<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * Allows access to users with admin or operador role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'No autenticado.');
        }

        if (! $user->hasRole('admin') && ! $user->hasRole('operador')) {
            abort(403, 'Acceso denegado. Se requieren permisos de administrador o de operador.');
        }

        return $next($request);
    }
}
