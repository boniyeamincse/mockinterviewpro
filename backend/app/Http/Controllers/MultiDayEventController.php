<?php

namespace App\Http\Controllers;

use App\Models\MultiDayEvent;
use App\Models\MultiDaySession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MultiDayEventController extends Controller
{
    // Get all published events
    public function index(Request $request)
    {
        $query = MultiDayEvent::where('published_at', '!=', null)
            ->with('tutor:id,name,email')
            ->orderBy('published_at', 'desc');

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->difficulty) {
            $query->where('difficulty_level', $request->difficulty);
        }

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->tutor_id) {
            $query->where('tutor_id', $request->tutor_id);
        }

        return response()->json([
            'data' => $query->paginate(12),
            'filters' => [
                'categories' => ['Data Structures', 'Algorithms', 'System Design', 'Web Development', 'Database Design', 'Behavioral'],
                'difficulties' => ['Beginner', 'Intermediate', 'Advanced'],
                'packages' => ['3 Days', '5 Days', '7 Days', '9 Days', 'Custom'],
            ]
        ]);
    }

    // Get single event details
    public function show($id)
    {
        $event = MultiDayEvent::with([
            'tutor:id,name,email,profile_image',
            'bookings' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }
        ])->findOrFail($id);

        $totalSessions = $event->sessions()->count();
        $bookedCount = $event->bookings()->where('status', '!=', 'cancelled')->count();

        return response()->json([
            'event' => $event,
            'stats' => [
                'total_sessions' => $totalSessions,
                'bookings_count' => $bookedCount,
                'availability' => max(0, $event->total_days - $bookedCount),
            ],
            'schedule_preview' => $this->generateSchedulePreview($event),
        ]);
    }

    // Create event (tutor only)
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== 'trainer') {
            return response()->json(['error' => 'Only trainers can create events'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'category' => 'required|string',
            'total_days' => 'required|integer|min:1|max:30',
            'duration_minutes_per_day' => 'required|integer|min:30|max:480',
            'price_bdt' => 'required|integer|min:500',
            'difficulty_level' => 'required|in:beginner,intermediate,advanced',
            'topics' => 'array',
            'prerequisites' => 'array',
            'package_type' => 'required|in:3days,5days,7days,9days,custom',
        ]);

        $event = MultiDayEvent::create(array_merge($validated, [
            'tutor_id' => $user->id,
            'status' => 'scheduled',
            'published_at' => now(),
        ]));

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event,
        ], 201);
    }

    // Update event (tutor only)
    public function update(Request $request, $id)
    {
        $event = MultiDayEvent::findOrFail($id);
        $user = Auth::user();

        if ($event->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string|min:50',
            'category' => 'string',
            'price_bdt' => 'integer|min:500',
            'difficulty_level' => 'in:beginner,intermediate,advanced',
            'topics' => 'array',
            'prerequisites' => 'array',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event,
        ]);
    }

    // Delete event (tutor only, only if no bookings)
    public function destroy($id)
    {
        $event = MultiDayEvent::findOrFail($id);
        $user = Auth::user();

        if ($event->tutor_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($event->bookings()->where('status', '!=', 'cancelled')->exists()) {
            return response()->json(['error' => 'Cannot delete event with active bookings'], 400);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    // Get tutor's events
    public function tutorEvents()
    {
        $user = Auth::user();

        if ($user->user_type !== 'trainer') {
            return response()->json(['error' => 'Only trainers can view their events'], 403);
        }

        $events = MultiDayEvent::where('tutor_id', $user->id)
            ->with('bookings')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'total_days' => $event->total_days,
                    'price_bdt' => $event->price_bdt,
                    'bookings_count' => $event->bookings()->where('status', '!=', 'cancelled')->count(),
                    'status' => $event->status,
                    'created_at' => $event->created_at,
                ];
            });

        return response()->json([
            'events' => $events,
            'total' => count($events),
        ]);
    }

    // Generate schedule preview for booking
    private function generateSchedulePreview(MultiDayEvent $event)
    {
        $schedule = [];
        $startDate = now()->addDays(1)->startOfDay();

        for ($i = 1; $i <= min($event->total_days, 5); $i++) {
            $sessionDate = $startDate->copy()->addDays($i - 1);
            $schedule[] = [
                'day' => $i,
                'date' => $sessionDate->format('Y-m-d'),
                'time' => '10:00 AM - ' . Carbon::createFromFormat('H:i', '10:' . sprintf('%02d', $event->duration_minutes_per_day % 60))->format('h:i A'),
                'duration_minutes' => $event->duration_minutes_per_day,
            ];
        }

        return $schedule;
    }
}
