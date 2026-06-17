<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/admin/employees', [AdminController::class, 'store'])->name('admin.employees.store');
    Route::post('/admin/employees/{id}/reset-password', [AdminController::class, 'resetPassword'])->name('admin.employees.reset-password');
    Route::delete('/admin/employees/{id}', [AdminController::class, 'destroy'])->name('admin.employees.destroy');
});
