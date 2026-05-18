<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TrainerProfileController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isTrainer() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Trainer access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }
        return null;
    }

    public function show(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json(['success' => true, 'message' => 'Profile retrieved', 'data' => Auth::user()->fresh()]);
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
            'expertise' => 'nullable|array',
            'expertise.*' => 'string|max:100',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'linkedin_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'academic_background' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            'certifications.*' => 'string|max:200',
        ]);

        $user = Auth::user();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Store new image
            $file = $request->file('profile_image');
            $filename = 'trainers/' . Str::slug($user->id) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $path = Storage::disk('public')->putFileAs('trainers', $file, basename($filename));
            $validated['profile_image'] = $path;
        }

        // Remove profile_image from validated if not set
        unset($validated['profile_image']);

        // Update user profile
        $user->update($validated);

        // Update profile_image separately if it was uploaded
        if ($request->hasFile('profile_image')) {
            $user->update(['profile_image' => $path]);
        }

        return response()->json(['success' => true, 'message' => 'Profile updated', 'data' => $user->fresh()]);
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
            return response()->json(['success' => false, 'message' => 'Current password is incorrect', 'code' => 'INVALID_PASSWORD'], 401);
        }

        $user->update(['password' => Hash::make($validated['password'])]);
        $user->tokens()->delete();

        return response()->json(['success' => true, 'message' => 'Password changed successfully', 'data' => null]);
    }
}
