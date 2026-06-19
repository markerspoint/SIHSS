<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMedical
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && in_array($request->user()->role, ['medical', 'admin'])) {
            return $next($request);
        }

        abort(403, 'Unauthorized access.');
    }
}
