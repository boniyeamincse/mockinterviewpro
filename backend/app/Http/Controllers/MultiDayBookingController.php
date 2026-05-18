<?php

namespace App\Http\Controllers;

use App\Models\MultiDayEvent;
use App\Models\MultiDayBooking;
use App\Models\MultiDaySession;
use App\Models\SessionAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MultiDayBookingController extends Controller
{
    // Book a multi-day event
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== 'student') {
            return response()->json(['error' => 'Only students can book events'], 403);
        }

        $validated = $request->validate([
            'event_id' => 'required|exists:multi_day_events,id',
        ]);

        $event = MultiDayEvent::findOrFail($validated['event_id']);

        // Check if user already booked this event
        $existingBooking = MultiDayBooking::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingBooking) {
            return response()->json(['error' => 'You have already booked this event'], 400);
        }

        // Check if user is the tutor
        if ($event->tutor_id === $user->id) {
            return response()->json(['error' => 'You cannot book your own event'], 400);
        }

        // Create booking
        $booking = MultiDayBooking::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'tutor_id' => $event->tutor_id,
            'total_days' => $event->total_days,
            'completed_days' => 0,
            'total_price_bdt' => $event->price_bdt,
            'status' => 'confirmed',
            'started_at' => now(),
        ]);

        // Generate sessions for each day
        $this->generateSessions($event, $booking);

        return response()->json([
            'message' => 'Event booked successfully',
            'booking' => $booking,
            'redirect' => '/user/multi-day-events/' . $booking->id,
        ], 201);
    }

    // Get user's bookings
    public function userBookings()
    {
        $user = Auth::user();

        $bookings = MultiDayBooking::where('user_id', $user->id)
            ->with(['event:id,title,category,total_days', 'tutor:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'event' => $booking->event,
                    'tutor' => $booking->tutor,
                    'total_days' => $booking->total_days,
                    'completed_days' => $booking->completed_days,
                    'progress_percentage' => $booking->getProgressPercentage(),
                    'status' => $booking->status,
                    'next_session' => $booking->getNextSession()?->only(['id', 'day_number', 'scheduled_at']),
                    'created_at' => $booking->created_at,
                ];
            });

        return response()->json(['bookings' => $bookings]);
    }

    // Get tutor's bookings
    public function tutorBookings()
    {
        $user = Auth::user();

        if ($user->user_type !== 'trainer') {
            return response()->json(['error' => 'Only trainers can view bookings'], 403);
        }

        $bookings = MultiDayBooking::where('tutor_id', $user->id)
            ->with(['event:id,title,category', 'user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['bookings' => $bookings]);
    }

    // Get booking details
    public function show($id)
    {
        $booking = MultiDayBooking::with([
            'event:id,title,description,category,total_days,duration_minutes_per_day',
            'user:id,name,email',
            'tutor:id,name,email',
            'sessions' => function ($query) {
                $query->orderBy('day_number');
            },
            'progress' => function ($query) {
                $query->orderBy('day_number');
            }
        ])->findOrFail($id);

        $user = Auth::user();

        // Check authorization
        if ($booking->user_id !== $user->id && $booking->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'booking' => $booking,
            'progress' => [
                'completed_days' => $booking->completed_days,
                'total_days' => $booking->total_days,
                'percentage' => $booking->getProgressPercentage(),
            ],
            'next_session' => $booking->getNextSession(),
        ]);
    }

    // Cancel booking
    public function cancel(Request $request, $id)
    {
        $booking = MultiDayBooking::findOrFail($id);
        $user = Auth::user();

        if ($booking->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $booking->cancel($validated['reason']);

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'booking' => $booking,
        ]);
    }

    // Generate sessions for a booking
    private function generateSessions(MultiDayEvent $event, MultiDayBooking $booking)
    {
        $startDate = now()->addDays(1)->startOfDay()->setTime(10, 0);

        for ($i = 1; $i <= $event->total_days; $i++) {
            $scheduledAt = $startDate->copy()->addDays($i - 1);
            $endsAt = $scheduledAt->copy()->addMinutes($event->duration_minutes_per_day);

            MultiDaySession::create([
                'event_id' => $event->id,
                'booking_id' => $booking->id,
                'day_number' => $i,
                'scheduled_at' => $scheduledAt,
                'ends_at' => $endsAt,
                'status' => 'scheduled',
            ]);
        }
    }
}
