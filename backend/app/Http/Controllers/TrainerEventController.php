<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerEventController extends Controller
{
    private function trainerOr403(): ?JsonResponse
    {
        $user = Auth::user();
        if (!$user || (!$user->isTrainer() && !$user->isAdmin())) {
            return response()->json([
                'success' => false,
                'message' => 'Trainer access required',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        return null;
    }

    public function store(Request $request): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'interview_type' => 'required|string|max:100',
            'description' => 'required|string|max:5000',
            'topics_covered' => 'required|array|min:1',
            'topics_covered.*' => 'string|max:255',
            'process_overview' => 'nullable|string|max:3000',
            'language' => 'nullable|string|max:100',
            'sample_questions' => 'nullable|array|max:20',
            'sample_questions.*' => 'string|max:500',
            'total_sessions' => 'required|integer|min:1|max:500',
            'duration_minutes' => 'required|integer|in:30,45,60,90',
            'price_bdt' => 'required|integer|min:200|max:100000',
            'cancellation_policy' => 'required|string|max:2000',
            'reschedule_policy' => 'nullable|string|max:2000',
            'available_slots' => 'nullable|array',
            'available_slots.*' => 'date',
            'blocked_dates' => 'nullable|array',
            'blocked_dates.*' => 'date',
            'timezone' => 'required|timezone',
            'slot_buffer_minutes' => 'nullable|integer|min:0|max:180',
            'advance_notice_hours' => 'nullable|integer|min:0|max:168',
            'status' => 'nullable|in:draft,published,archived',
        ]);

        $event = Event::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status' => $validated['status'] ?? 'draft',
            'language' => $validated['language'] ?? 'Bangla + English',
            'slot_buffer_minutes' => $validated['slot_buffer_minutes'] ?? 15,
            'advance_notice_hours' => $validated['advance_notice_hours'] ?? 24,
            'available_slots' => $validated['available_slots'] ?? [],
            'blocked_dates' => $validated['blocked_dates'] ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $query = Event::query()->where('user_id', Auth::id());

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $perPage = min((int) $request->get('per_page', 15), 100);

        return response()->json([
            'success' => true,
            'message' => 'Trainer events retrieved successfully',
            'data' => $query->orderByDesc('created_at')->paginate($perPage),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Event retrieved successfully',
            'data' => $event,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'interview_type' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:5000',
            'topics_covered' => 'nullable|array|min:1',
            'topics_covered.*' => 'string|max:255',
            'process_overview' => 'nullable|string|max:3000',
            'language' => 'nullable|string|max:100',
            'sample_questions' => 'nullable|array|max:20',
            'sample_questions.*' => 'string|max:500',
            'total_sessions' => 'sometimes|required|integer|min:1|max:500',
            'duration_minutes' => 'sometimes|required|integer|in:30,45,60,90',
            'price_bdt' => 'sometimes|required|integer|min:200|max:100000',
            'cancellation_policy' => 'nullable|string|max:2000',
            'reschedule_policy' => 'nullable|string|max:2000',
            'available_slots' => 'nullable|array',
            'available_slots.*' => 'date',
            'blocked_dates' => 'nullable|array',
            'blocked_dates.*' => 'date',
            'timezone' => 'nullable|timezone',
            'slot_buffer_minutes' => 'nullable|integer|min:0|max:180',
            'advance_notice_hours' => 'nullable|integer|min:0|max:168',
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event->fresh(),
        ]);
    }

    public function publish(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $event->update(['status' => 'published', 'published_at' => now(), 'archived_at' => null]);

        return response()->json(['success' => true, 'message' => 'Event published successfully', 'data' => $event->fresh()]);
    }

    public function unpublish(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $event->update(['status' => 'draft', 'published_at' => null]);

        return response()->json(['success' => true, 'message' => 'Event moved to draft', 'data' => $event->fresh()]);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $hasBookings = DB::table('bookings')->where('event_id', $event->id)->exists();

        if ($hasBookings) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete event with bookings',
                'code' => 'EVENT_HAS_BOOKINGS',
            ], 422);
        }

        $event->delete();
        return response()->json(['success' => true, 'message' => 'Event deleted successfully', 'data' => null]);
    }

    public function addSlots(Request $request, int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $event = Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'slots' => 'required|array|min:1',
            'slots.*.starts_at' => 'required|date',
            'slots.*.ends_at' => 'nullable|date',
        ]);

        $created = [];
        foreach ($validated['slots'] as $slot) {
            $created[] = DB::table('event_slots')->insertGetId([
                'event_id' => $event->id,
                'starts_at' => $slot['starts_at'],
                'ends_at' => $slot['ends_at'] ?? null,
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Slots added successfully',
            'data' => DB::table('event_slots')->whereIn('id', $created)->get(),
        ], 201);
    }

    public function listSlots(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        Event::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Slots retrieved successfully',
            'data' => DB::table('event_slots')->where('event_id', $id)->orderBy('starts_at')->get(),
        ]);
    }

    public function deleteSlot(int $slotId): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $slot = DB::table('event_slots')
            ->join('events', 'events.id', '=', 'event_slots.event_id')
            ->where('event_slots.id', $slotId)
            ->where('events.user_id', Auth::id())
            ->select('event_slots.*')
            ->first();

        if (!$slot) {
            return response()->json(['success' => false, 'message' => 'Slot not found', 'code' => 'NOT_FOUND'], 404);
        }

        if ($slot->status === 'booked') {
            return response()->json(['success' => false, 'message' => 'Booked slot cannot be removed', 'code' => 'SLOT_BOOKED'], 422);
        }

        DB::table('event_slots')->where('id', $slotId)->delete();

        return response()->json(['success' => true, 'message' => 'Slot removed successfully', 'data' => null]);
    }

    public function blockAvailability(Request $request): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $validated = $request->validate([
            'blocked_date' => 'required|date',
            'reason' => 'nullable|string|max:255',
        ]);

        DB::table('availability_blocks')->updateOrInsert(
            ['user_id' => Auth::id(), 'blocked_date' => $validated['blocked_date']],
            ['reason' => $validated['reason'] ?? null, 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Availability blocked', 'data' => null], 201);
    }

    public function unblockAvailability(int $id): JsonResponse
    {
        if ($resp = $this->trainerOr403()) {
            return $resp;
        }

        $deleted = DB::table('availability_blocks')->where('id', $id)->where('user_id', Auth::id())->delete();

        if (!$deleted) {
            return response()->json(['success' => false, 'message' => 'Blocked date not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Blocked date removed', 'data' => null]);
    }
}
