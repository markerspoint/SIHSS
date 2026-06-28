<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MedicalController;
use App\Http\Controllers\PharmacyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'admin', 'prevent-back'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/admin/employees', [AdminController::class, 'store'])->name('admin.employees.store');
    Route::put('/admin/employees/{id}', [AdminController::class, 'update'])->name('admin.employees.update');
    Route::post('/admin/employees/{id}/reset-password', [AdminController::class, 'resetPassword'])->name('admin.employees.reset-password');
    Route::delete('/admin/employees/{id}', [AdminController::class, 'destroy'])->name('admin.employees.destroy');
});

Route::middleware(['auth', 'medical', 'prevent-back'])->group(function () {
    Route::get('/medical/dashboard', [MedicalController::class, 'dashboard'])->name('medical.dashboard');
    
    // Mental Health Module
    Route::middleware(['module:mental_health'])->group(function () {
        Route::get('/medical/geotagging', [MedicalController::class, 'geotagging'])->name('medical.geotagging');
        Route::post('/medical/geotagging', [MedicalController::class, 'storePatient'])->name('medical.geotagging.store');
        Route::delete('/medical/geotagging/{id}', [MedicalController::class, 'deletePatient'])->name('medical.geotagging.delete');
        Route::get('/medical/patients-tagged', [MedicalController::class, 'patientsTagged'])->name('medical.patients-tagged');
        Route::get('/medical/patient-records', [MedicalController::class, 'patientRecords'])->name('medical.patient-records');
    });

    // Pharmacy Module
    Route::middleware(['module:pharmacy'])->group(function () {
        Route::get('/medical/pharmacy/dispensing', [PharmacyController::class, 'dispensing'])->name('medical.pharmacy.dispensing');
        Route::post('/medical/pharmacy/dispensing', [PharmacyController::class, 'storeDispensation'])->name('medical.pharmacy.dispensing.store');
        Route::delete('/medical/pharmacy/dispensing/{id}', [PharmacyController::class, 'destroyDispensation'])->name('medical.pharmacy.dispensing.destroy');
        Route::put('/medical/pharmacy/dispensing/{id}', [PharmacyController::class, 'updateDispensation'])->name('medical.pharmacy.dispensing.update');

        Route::get('/medical/pharmacy/patients', [PharmacyController::class, 'patients'])->name('medical.pharmacy.patients');
    });
});
