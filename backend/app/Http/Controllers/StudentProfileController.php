<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $user = Auth::user();
        
        // Fetch stats & relations dynamically
        $completedCount = \App\Models\Booking::where('student_id', $user->id)
            ->where('status', 'completed')
            ->count();
            
        $history = \App\Models\Booking::where('student_id', $user->id)
            ->with(['event', 'trainer'])
            ->orderBy('scheduled_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'event_id' => $booking->event_id,
                    'event_title' => $booking->event ? $booking->event->title : 'Interview Session',
                    'trainer_name' => $booking->trainer ? $booking->trainer->name : 'Expert Trainer',
                    'status' => $booking->status,
                    'scheduled_at' => $booking->scheduled_at,
                    'completed_at' => $booking->completed_at,
                ];
            });

        $reviews = \App\Models\Review::where('student_id', $user->id)
            ->with(['event'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'event_title' => $review->event ? $review->event->title : 'Interview Session',
                    'created_at' => $review->created_at,
                ];
            });

        $userData = $user->fresh();
        
        // Append these custom structures
        $response = array_merge($userData->toArray(), [
            'completed_sessions_count' => $completedCount,
            'interview_history' => $history,
            'reviews_given' => $reviews,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved',
            'data' => $response,
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
            'gender' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            
            // New fields
            'skills' => 'nullable|string|max:2000',
            'experience_level' => 'nullable|string|max:100',
            'portfolio_links' => 'nullable|string|max:2000',
            'github_profile' => 'nullable|string|max:255',
            'linkedin_profile' => 'nullable|string|max:255',
            'certificates' => 'nullable|string', 
            'earned_badges' => 'nullable|string', 
            'points' => 'nullable|integer',
            'rank' => 'nullable|string|max:100',
            'profile_image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', 
        ]);

        $user = Auth::user();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $file = $request->file('profile_image');
            $filename = 'students/' . Str::slug($user->id) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $path = Storage::disk('public')->putFileAs('students', $file, basename($filename));
            $validated['profile_image'] = $path;
        }

        // Handle resume file upload
        if ($request->hasFile('resume_file')) {
            if ($user->resume_path) {
                Storage::disk('public')->delete($user->resume_path);
            }
            $file = $request->file('resume_file');
            $filename = 'resumes/' . Str::slug($user->id) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $path = Storage::disk('public')->putFileAs('resumes', $file, basename($filename));
            $validated['resume_path'] = $path;
        }

        // Store file variables separately before mass-updating the model
        $profileImagePath = isset($validated['profile_image']) ? $validated['profile_image'] : null;
        $resumeFilePath = isset($validated['resume_path']) ? $validated['resume_path'] : null;

        unset($validated['profile_image']);
        unset($validated['resume_file']);

        // Update text/basic fields
        $user->update($validated);

        // Update file paths separately
        if ($profileImagePath) {
            $user->update(['profile_image' => $profileImagePath]);
        }
        if ($resumeFilePath) {
            $user->update(['resume_path' => $resumeFilePath]);
        }

        return $this->show(); 
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
