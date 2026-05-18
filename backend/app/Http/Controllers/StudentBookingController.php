<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentBookingController extends Controller
{
    private function studentGuard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isStudent() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        return null;
    }

    public function store(Request $request): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        $validated = $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'slot_id' => 'required|integer|exists:event_slots,id',
        ]);

        $event = Event::findOrFail($validated['event_id']);
        $slot = DB::table('event_slots')->where('id', $validated['slot_id'])->where('event_id', $event->id)->where('status', 'open')->first();

        if (!$slot) {
            return response()->json(['success' => false, 'message' => 'Slot not available', 'code' => 'SLOT_NOT_AVAILABLE'], 422);
        }

        $bookingId = DB::table('bookings')->insertGetId([
            'event_id' => $event->id,
            'trainer_id' => $event->user_id,
            'student_id' => Auth::id(),
            'slot_id' => $slot->id,
            'status' => 'upcoming',
            'scheduled_at' => $slot->starts_at,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('event_slots')->where('id', $slot->id)->update(['status' => 'booked', 'booking_id' => $bookingId, 'updated_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created',
            'data' => DB::table('bookings')->where('id', $bookingId)->first(),
        ], 201);
    }

    public function index(): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Bookings retrieved',
            'data' => DB::table('bookings')->where('student_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        $booking = DB::table('bookings')->where('id', $id)->where('student_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Booking detail retrieved', 'data' => $booking]);
    }

    public function upcoming(): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Upcoming bookings retrieved',
            'data' => DB::table('bookings')
                ->where('student_id', Auth::id())
                ->where('status', 'upcoming')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->get(),
        ]);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        $request->validate(['reason' => 'nullable|string|max:500']);

        $booking = DB::table('bookings')->where('id', $id)->where('student_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        DB::table('bookings')->where('id', $id)->update(['status' => 'cancelled', 'cancel_reason' => $request->reason, 'updated_at' => now()]);
        DB::table('event_slots')->where('id', $booking->slot_id)->update(['status' => 'open', 'booking_id' => null, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Booking cancelled', 'data' => null]);
    }

    public function reschedule(Request $request, int $id): JsonResponse
    {
        if ($r = $this->studentGuard()) {
            return $r;
        }

        $validated = $request->validate(['slot_id' => 'required|integer|exists:event_slots,id']);

        $booking = DB::table('bookings')->where('id', $id)->where('student_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        $newSlot = DB::table('event_slots')->where('id', $validated['slot_id'])->where('event_id', $booking->event_id)->where('status', 'open')->first();
        if (!$newSlot) {
            return response()->json(['success' => false, 'message' => 'New slot not available', 'code' => 'SLOT_NOT_AVAILABLE'], 422);
        }

        DB::table('event_slots')->where('id', $booking->slot_id)->update(['status' => 'open', 'booking_id' => null, 'updated_at' => now()]);
        DB::table('event_slots')->where('id', $newSlot->id)->update(['status' => 'booked', 'booking_id' => $booking->id, 'updated_at' => now()]);
        DB::table('bookings')->where('id', $booking->id)->update(['slot_id' => $newSlot->id, 'scheduled_at' => $newSlot->starts_at, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Booking rescheduled', 'data' => DB::table('bookings')->where('id', $booking->id)->first()]);
    }
}
