<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $admin = User::where('email', $validated['email'])->where('user_type', 'admin')->first();

        if (!$admin || !Hash::check($validated['password'], $admin->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials', 'code' => 'INVALID_CREDENTIALS'], 401);
        }

        if (!$admin->is_active) {
            return response()->json(['success' => false, 'message' => 'Account inactive', 'code' => 'ACCOUNT_INACTIVE'], 403);
        }

        $admin->tokens()->delete();
        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Admin login successful',
            'data' => [
                'user' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'user_type' => $admin->user_type,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || $user->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Admin access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        $request->user()->currentAccessToken()?->delete();

        return response()->json(['success' => true, 'message' => 'Admin logout successful', 'data' => null]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user || $user->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Admin access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        $request->user()->currentAccessToken()?->delete();
        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Admin token refreshed',
            'data' => ['access_token' => $token, 'token_type' => 'Bearer'],
        ]);
    }
}
