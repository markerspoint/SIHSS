<?php

namespace App\Http\Controllers;

use App\Models\PatientRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalController extends Controller
{
    public function dashboard()
    {
        $totalTagged = PatientRecord::count();
        $activeCases = PatientRecord::count(); // Simplified for clinical registry mapping
        $totalRecords = PatientRecord::count();

        // Get recent 5 geotags
        $recentTags = PatientRecord::latest()->take(5)->get();

        // Count of patients grouped by condition
        $conditionsData = PatientRecord::select('condition')
            ->selectRaw('count(*) as count')
            ->groupBy('condition')
            ->get();

        return Inertia::render('medical/dashboard', [
            'stats' => [
                'totalTagged' => $totalTagged,
                'activeCases' => $activeCases,
                'totalRecords' => $totalRecords,
            ],
            'recentTags' => $recentTags,
            'conditionsData' => $conditionsData,
        ]);
    }

    public function geotagging()
    {
        $patients = PatientRecord::latest()->get();
        return Inertia::render('medical/mentalhealth/geotagging', [
            'patients' => $patients
        ]);
    }

    public function storePatient(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'condition' => 'required|string|max:255',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        PatientRecord::create($validated);

        return redirect()->back()->with('success', 'Patient geotagged successfully.');
    }

    public function deletePatient($id)
    {
        $patient = PatientRecord::findOrFail($id);
        $patient->delete();

        return redirect()->back()->with('success', 'Patient record deleted.');
    }

    public function patientsTagged()
    {
        $patients = PatientRecord::latest()->get();
        return Inertia::render('medical/mentalhealth/patients-tagged', [
            'patients' => $patients
        ]);
    }

    public function patientRecords()
    {
        $patients = PatientRecord::latest()->get();
        return Inertia::render('medical/mentalhealth/patient-records', [
            'patients' => $patients
        ]);
    }
}
