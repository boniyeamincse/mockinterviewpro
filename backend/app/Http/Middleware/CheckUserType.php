<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$types): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
                'code' => 'UNAUTHENTICATED',
            ], 401);
        }

        $user = auth()->user();

        if (!in_array($user->user_type, $types)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - You do not have access to this resource',
                'code' => 'UNAUTHORIZED',
            ], 403);
        }

        return $next($request);
    }
}
