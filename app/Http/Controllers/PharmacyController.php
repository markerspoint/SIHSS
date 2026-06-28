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
        
        $patients = $dispensations->groupBy(function ($item) {
            $parts = array_filter([$item->first_name, $item->middle_name, $item->last_name, $item->suffix]);
            return implode(' ', $parts);
        })->map(function ($patientDispensations, $fullName) {
            $firstRecord = $patientDispensations->first();
            return [
                'name' => $fullName,
                'first_name' => $firstRecord->first_name,
                'middle_name' => $firstRecord->middle_name,
                'last_name' => $firstRecord->last_name,
                'suffix' => $firstRecord->suffix,
                'age' => $firstRecord->age,
                'civil_status' => $firstRecord->civil_status,
                'birthdate' => $firstRecord->birthdate,
                'barangay' => $firstRecord->barangay,
            ];
        })->values();
        
        return Inertia::render('medical/pharmacy/dispensing', [
            'dispensations' => $dispensations,
            'patients' => $patients
        ]);
    }

    /**
     * Dispense medicine to patient.
     */
    public function storeDispensation(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'age' => 'required|integer|min:0|max:150',
            'civil_status' => 'required|string|max:50',
            'birthdate' => 'required|date',
            'barangay' => 'required|string|max:255',
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
     * Update existing dispensation record.
     */
    public function updateDispensation(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $record = DispensationRecord::findOrFail($id);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'age' => 'required|integer|min:0|max:150',
            'civil_status' => 'required|string|max:50',
            'birthdate' => 'required|date',
            'barangay' => 'required|string|max:255',
            'generic_name' => 'required|string|max:255',
            'dosage' => 'required|string|max:255',
            'form' => 'required|string|max:255',
            'quantity_dispensed' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $record->update($validated);

        return redirect()->back()->with('success', 'Dispensation record updated successfully.');
    }

    /**
     * Display patient medication history.
     */
    public function patients(): \Inertia\Response
    {
        $dispensations = DispensationRecord::latest()->get();
        
        $patients = $dispensations->groupBy(function ($item) {
            $parts = array_filter([$item->first_name, $item->middle_name, $item->last_name, $item->suffix]);
            return implode(' ', $parts);
        })->map(function ($patientDispensations, $fullName) {
            $firstRecord = $patientDispensations->first();
            return [
                'name' => $fullName,
                'first_name' => $firstRecord->first_name,
                'middle_name' => $firstRecord->middle_name,
                'last_name' => $firstRecord->last_name,
                'suffix' => $firstRecord->suffix,
                'age' => $firstRecord->age,
                'civil_status' => $firstRecord->civil_status,
                'birthdate' => $firstRecord->birthdate,
                'barangay' => $firstRecord->barangay,
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
