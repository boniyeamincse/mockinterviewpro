<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentProfileController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isStudent() && !$u->isAdmin())) {
            return response()->json([
                'success' => false,
                'message' => 'Student access required',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        return null;
    }

    public function show(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved',
            'data' => Auth::user()->fresh(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
            'goals' => 'nullable|string|max:2000',
            'career_goal' => 'nullable|string|max:255',
            'interests' => 'nullable|string|max:2000',
            'academic_inst' => 'nullable|string|max:255',
            'academic_degree' => 'nullable|string|max:255',
            'academic_grad_year' => 'nullable|integer|min:1950|max:2100',
        ]);

        $user = Auth::user();
        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated',
            'data' => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed|different:current_password',
        ]);

        $user = Auth::user();
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
                'code' => 'INVALID_PASSWORD',
            ], 401);
        }

        $user->update(['password' => Hash::make($validated['password'])]);
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
            'data' => null,
        ]);
    }
}
