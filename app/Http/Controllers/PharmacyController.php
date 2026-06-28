<?php

namespace App\Http\Controllers;

use App\Models\DispensationRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PharmacyController extends Controller
{
    /**
     * Display dispensation portal.
     */
    public function dispensing(): \Inertia\Response
    {
        $dispensations = DispensationRecord::latest()->get();
        
        return Inertia::render('medical/pharmacy/dispensing', [
            'dispensations' => $dispensations
        ]);
    }

    /**
     * Dispense medicine to patient.
     */
    public function storeDispensation(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'generic_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'form' => 'required|string|max:255',
            'quantity_dispensed' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        DispensationRecord::create($validated);

        return redirect()->back()->with('success', 'Medicine successfully dispensed.');
    }

    /**
     * Reverse/delete dispensation record.
     */
    public function destroyDispensation(string $id): \Illuminate\Http\RedirectResponse
    {
        $record = DispensationRecord::findOrFail($id);
        $record->delete();

        return redirect()->back()->with('success', 'Dispensation reversed successfully.');
    }

    /**
     * Display patient medication history.
     */
    public function patients(): \Inertia\Response
    {
        $dispensations = DispensationRecord::latest()->get();
        
        $patients = $dispensations->groupBy('patient_name')->map(function ($patientDispensations, $name) {
            return [
                'name' => $name,
                'last_visit' => $patientDispensations->max('created_at')->toIso8601String(),
                'history' => $patientDispensations->map(function ($disp) {
                    return [
                        'id' => $disp->id,
                        'generic_name' => $disp->generic_name,
                        'dosage' => $disp->dosage,
                        'form' => $disp->form,
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
