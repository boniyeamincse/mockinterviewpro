<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => 'required|in:student,trainer,admin',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => $validated['user_type'],
            'phone' => $validated['phone'] ?? null,
            'email_verified_at' => null,
            'is_active' => true,
        ]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $this->formatUser($user),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ],
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
                'code' => 'INVALID_CREDENTIALS',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is inactive. Please contact support.',
                'code' => 'ACCOUNT_INACTIVE',
            ], 403);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email not verified. Please check your email.',
                'code' => 'EMAIL_NOT_VERIFIED',
            ], 403);
        }

        // Revoke all existing tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Update last login
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $this->formatUser($user),
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ],
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function getCurrentUser(Request $request): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => $this->formatUserWithDetails($user),
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'profile_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile-images', 'public');
            $validated['profile_image'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $this->formatUser($user),
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed|different:current_password',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
                'code' => 'INVALID_PASSWORD',
            ], 401);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Revoke all tokens to force re-login
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully. Please login again.',
            'data' => null,
        ]);
    }

    /**
     * Request password reset
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Generate reset token
        $token = \Illuminate\Support\Str::random(60);

        // Store token in database (you may need to create a password_resets table)
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $validated['email']],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Send reset email (implement this based on your mail setup)
        // Mail::send('emails.password-reset', ['token' => $token, 'user' => $user]);

        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email',
            'data' => null,
        ]);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $resetRecord = \DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$resetRecord || !Hash::check($validated['token'], $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token',
                'code' => 'INVALID_TOKEN',
            ], 401);
        }

        // Check if token expired (24 hours)
        if (Carbon::parse($resetRecord->created_at)->addHours(24)->isPast()) {
            \DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return response()->json([
                'success' => false,
                'message' => 'Password reset token has expired',
                'code' => 'TOKEN_EXPIRED',
            ], 401);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->update(['password' => Hash::make($validated['password'])]);

        // Delete used token
        \DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. Please login with your new password.',
            'data' => null,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($request->get('all_devices')) {
            // Logout from all devices
            $user->tokens()->delete();
        } else {
            // Logout from current device only
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
            'data' => null,
        ]);
    }

    /**
     * Refresh token
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Delete current token
        $request->user()->currentAccessToken()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ],
        ]);
    }

    /**
     * Verify email
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'code' => 'USER_NOT_FOUND',
            ], 404);
        }

        // Check verification code (implement based on your verification setup)
        // For now, we'll mark email as verified
        if ($validated['verification_code'] === env('VERIFICATION_CODE', '000000')) {
            $user->update(['email_verified_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Email verified successfully',
                'data' => $this->formatUser($user),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid verification code',
            'code' => 'INVALID_CODE',
        ], 401);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified',
                'code' => 'ALREADY_VERIFIED',
            ], 400);
        }

        // Generate verification code
        $code = random_int(100000, 999999);

        // Store in cache or database
        cache()->put("verification_code_{$user->id}", $code, now()->addHour());

        // Send verification email
        // Mail::send('emails.verification', ['code' => $code, 'user' => $user]);

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent',
            'data' => null,
        ]);
    }

    /**
     * Format user for response
     */
    private function formatUser($user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'user_type' => $user->user_type,
            'is_active' => $user->is_active,
            'email_verified_at' => $user->email_verified_at,
            'profile_image' => $user->profile_image,
            'created_at' => $user->created_at,
        ];
    }

    /**
     * Format user with details for get current user
     */
    private function formatUserWithDetails($user): array
    {
        return [
            ...$this->formatUser($user),
            'bio' => $user->bio,
            'last_login_at' => $user->last_login_at,
            'permissions' => $user->getPermissions(),
        ];
    }
}
