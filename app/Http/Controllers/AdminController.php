<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Render the admin dashboard.
     */
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->input('search');

        $employees = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/dashboard', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Generate a new employee account.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => ['required', 'string', 'unique:users,employee_id'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(['admin', 'medical', 'jo'])],
            'password' => ['required', 'string', 'min:4'],
        ]);

        User::create([
            'employee_id' => $validated['employee_id'],
            'name' => $validated['name'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Employee account successfully generated.');
    }

    /**
     * Reset an employee's password.
     */
    public function resetPassword(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:4'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Employee password successfully reset.');
    }

    /**
     * Delete an employee account.
     */
    public function destroy(string $id): \Illuminate\Http\RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['error' => 'You cannot delete your own administrative account.']);
        }

        $user->delete();

        return redirect()->back()->with('success', 'Employee account successfully deleted.');
    }
}
