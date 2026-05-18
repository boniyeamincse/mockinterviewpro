<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerBookingController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isTrainer() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Trainer access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }
        return null;
    }

    public function index(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $query = DB::table('bookings')->where('trainer_id', Auth::id());
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json(['success' => true, 'message' => 'Bookings retrieved', 'data' => $query->orderByDesc('id')->paginate(15)]);
    }

    public function show(int $bookingId): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $booking = DB::table('bookings')->where('id', $bookingId)->where('trainer_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Booking retrieved', 'data' => $booking]);
    }

    public function today(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $bookings = DB::table('bookings')
            ->where('trainer_id', Auth::id())
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        return response()->json(['success' => true, 'message' => 'Today bookings retrieved', 'data' => $bookings]);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $request->validate(['reason' => 'nullable|string|max:500']);

        $updated = DB::table('bookings')
            ->where('id', $id)
            ->where('trainer_id', Auth::id())
            ->update(['status' => 'cancelled', 'cancel_reason' => $request->reason, 'updated_at' => now()]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Booking cancelled successfully', 'data' => null]);
    }

    public function complete(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $updated = DB::table('bookings')
            ->where('id', $id)
            ->where('trainer_id', Auth::id())
            ->update(['status' => 'completed', 'completed_at' => now(), 'updated_at' => now()]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Booking completed successfully', 'data' => null]);
    }
}
