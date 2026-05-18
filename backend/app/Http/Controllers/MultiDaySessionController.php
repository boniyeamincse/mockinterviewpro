<?php

namespace App\Http\Controllers;

use App\Models\MultiDaySession;
use App\Models\MultiDayBooking;
use App\Models\SessionAttendance;
use App\Models\MultiDayProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MultiDaySessionController extends Controller
{
    // Get session details
    public function show($id)
    {
        $session = MultiDaySession::with('booking', 'event')
            ->findOrFail($id);

        $user = Auth::user();
        $booking = $session->booking;

        // Check authorization
        if ($booking->user_id !== $user->id && $booking->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'session' => $session,
            'can_join' => $session->canJoin(),
            'is_user' => $booking->user_id === $user->id,
            'is_tutor' => $booking->tutor_id === $user->id,
        ]);
    }

    // Join video session
    public function joinSession($id)
    {
        $session = MultiDaySession::with('booking')
            ->findOrFail($id);

        $user = Auth::user();
        $booking = $session->booking;

        // Check authorization
        if ($booking->user_id !== $user->id && $booking->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if session can be joined
        if (!$session->canJoin()) {
            return response()->json([
                'error' => 'Session not available for joining yet',
                'can_join_at' => $session->scheduled_at->subMinutes(5),
            ], 403);
        }

        // Generate video token if not exists
        if (!$session->video_token) {
            $session->video_token = Str::random(32);
            $session->status = 'ongoing';
            $session->save();
        }

        // Record attendance
        $attendance = SessionAttendance::updateOrCreate(
            [
                'session_id' => $session->id,
                'user_id' => $user->id,
            ],
            [
                'booking_id' => $booking->id,
                'attended' => true,
                'joined_at' => now(),
            ]
        );

        return response()->json([
            'session' => $session,
            'video_token' => $session->video_token,
            'video_room' => 'moc-' . $session->event_id . '-' . $session->booking_id,
            'duration_minutes' => $session->event->duration_minutes_per_day,
        ]);
    }

    // Leave session
    public function leaveSession(Request $request, $id)
    {
        $session = MultiDaySession::findOrFail($id);
        $user = Auth::user();

        $attendance = SessionAttendance::where('session_id', $session->id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $durationMinutes = now()->diffInMinutes($attendance->joined_at);
        $attendance->update([
            'left_at' => now(),
            'duration_minutes' => $durationMinutes,
        ]);

        return response()->json([
            'message' => 'Left session successfully',
            'duration_minutes' => $durationMinutes,
        ]);
    }

    // Mark session as completed
    public function completeSession(Request $request, $id)
    {
        $session = MultiDaySession::with('booking')
            ->findOrFail($id);

        $user = Auth::user();

        // Only tutor can mark as complete
        if ($session->booking->tutor_id !== $user->id) {
            return response()->json(['error' => 'Only tutor can mark as completed'], 403);
        }

        $validated = $request->validate([
            'topics_covered' => 'array',
            'feedback' => 'string|nullable|max:1000',
        ]);

        // Mark session as completed
        $session->status = 'completed';
        $session->completed_at = now();
        $session->save();

        // Update booking progress
        $session->booking->markSessionCompleted($session->day_number);

        // Create progress record
        MultiDayProgress::updateOrCreate(
            [
                'booking_id' => $session->booking->id,
                'day_number' => $session->day_number,
            ],
            [
                'topics_covered' => $validated['topics_covered'] ?? [],
                'feedback_from_tutor' => $validated['feedback'],
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Session marked as completed',
            'session' => $session,
            'booking_progress' => $session->booking->getProgressPercentage(),
        ]);
    }

    // Get session for video call
    public function videoSession($bookingId, $dayNumber)
    {
        $booking = MultiDayBooking::with('event', 'sessions')
            ->findOrFail($bookingId);

        $user = Auth::user();

        // Check authorization
        if ($booking->user_id !== $user->id && $booking->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $session = $booking->sessions()
            ->where('day_number', $dayNumber)
            ->firstOrFail();

        return response()->json([
            'session' => $session,
            'booking' => $booking,
            'can_join' => $session->canJoin(),
            'video_config' => [
                'room_name' => 'moc-' . $booking->event_id . '-' . $booking->id . '-day-' . $dayNumber,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'is_tutor' => $booking->tutor_id === $user->id,
            ],
        ]);
    }

    // Tutor view all sessions for an event
    public function eventSessions($eventId)
    {
        $user = Auth::user();

        $event = \App\Models\MultiDayEvent::with('sessions')
            ->findOrFail($eventId);

        if ($event->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $sessions = $event->sessions()
            ->with('booking:id,user_id,status', 'booking.user:id,name')
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json(['sessions' => $sessions]);
    }
}
