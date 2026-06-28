<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if ($user) {
            // Admins bypass module checks
            if ($user->role === 'admin') {
                return $next($request);
            }

            // Check if user has access to the specified module
            if (is_array($user->accessible_modules) && in_array($module, $user->accessible_modules)) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized access to the ' . str_replace('_', ' ', $module) . ' module.');
    }
}
