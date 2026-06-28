<?php

namespace App\Http\Controllers;

use App\Models\DispensationRecord;
use App\Models\PharmacyItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    /**
     * Display the drug inventory.
     */
    public function inventory(): \Inertia\Response
    {
        $inventory = PharmacyItem::latest()->get();
        return Inertia::render('medical/pharmacy/inventory', [
            'inventory' => $inventory
        ]);
    }

    /**
     * Store a new drug item in the inventory.
     */
    public function storeInventory(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'generic_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'form' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'expiration_date' => 'required|date',
            'batch_number' => 'required|string|max:100',
        ]);

        PharmacyItem::create($validated);

        return redirect()->back()->with('success', 'Medicine stock added to inventory.');
    }

    /**
     * Update drug item details.
     */
    public function updateInventory(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $item = PharmacyItem::findOrFail($id);

        $validated = $request->validate([
            'generic_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'form' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'expiration_date' => 'required|date',
            'batch_number' => 'required|string|max:100',
        ]);

        $item->update($validated);

        return redirect()->back()->with('success', 'Medicine details successfully updated.');
    }

    /**
     * Delete drug item from inventory.
     */
    public function destroyInventory(string $id): \Illuminate\Http\RedirectResponse
    {
        $item = PharmacyItem::findOrFail($id);
        $item->delete();

        return redirect()->back()->with('success', 'Medicine removed from inventory.');
    }

    /**
     * Display dispensation portal.
     */
    public function dispensing(): \Inertia\Response
    {
        $dispensations = DispensationRecord::with('pharmacyItem')->latest()->get();
        
        // Active inventory available for dispensing (must have positive stock and not expired)
        $drugs = PharmacyItem::where('quantity', '>', 0)
            ->where('expiration_date', '>', now())
            ->orderBy('generic_name')
            ->get();

        return Inertia::render('medical/pharmacy/dispensing', [
            'dispensations' => $dispensations,
            'drugs' => $drugs
        ]);
    }

    /**
     * Dispense medicine to patient.
     */
    public function storeDispensation(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'pharmacy_item_id' => 'required|exists:pharmacy_items,id',
            'quantity_dispensed' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($validated) {
            $item = PharmacyItem::lockForUpdate()->findOrFail($validated['pharmacy_item_id']);

            if ($item->quantity < $validated['quantity_dispensed']) {
                throw ValidationException::withMessages([
                    'quantity_dispensed' => 'Requested quantity exceeds available stock (' . $item->quantity . ' ' . $item->unit . ' left).'
                ]);
            }

            // Deduct stock
            $item->decrement('quantity', $validated['quantity_dispensed']);

            // Create record
            DispensationRecord::create($validated);
        });

        return redirect()->back()->with('success', 'Medicine successfully dispensed.');
    }

    /**
     * Reverse/delete dispensation record.
     */
    public function destroyDispensation(string $id): \Illuminate\Http\RedirectResponse
    {
        DB::transaction(function () use ($id) {
            $record = DispensationRecord::findOrFail($id);
            $item = PharmacyItem::lockForUpdate()->find($record->pharmacy_item_id);

            if ($item) {
                // Return stock
                $item->increment('quantity', $record->quantity_dispensed);
            }

            $record->delete();
        });

        return redirect()->back()->with('success', 'Dispensation reversed successfully.');
    }

    /**
     * Display patient medication history.
     */
    public function patients(): \Inertia\Response
    {
        $dispensations = DispensationRecord::with('pharmacyItem')->latest()->get();
        
        $patients = $dispensations->groupBy('patient_name')->map(function ($patientDispensations, $name) {
            return [
                'name' => $name,
                'last_visit' => $patientDispensations->max('created_at')->toIso8601String(),
                'history' => $patientDispensations->map(function ($disp) {
                    return [
                        'id' => $disp->id,
                        'generic_name' => $disp->pharmacyItem->generic_name ?? 'Unknown Drug',
                        'dosage' => $disp->pharmacyItem->dosage ?? '',
                        'form' => $disp->pharmacyItem->form ?? '',
                        'quantity_dispensed' => $disp->quantity_dispensed,
                        'notes' => $disp->notes,
                        'date' => $disp->created_at->toIso8601String(),
                    ];
                })
            ];
        })->values();

        return Inertia::render('medical/pharmacy/patients', [
            'patients' => $patients
        ]);
    }
}
