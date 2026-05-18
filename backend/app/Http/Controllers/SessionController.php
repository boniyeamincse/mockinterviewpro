<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    private function bookingForUser(int $bookingId)
    {
        $user = Auth::user();
        return DB::table('bookings')
            ->where('id', $bookingId)
            ->where(function ($q) use ($user) {
                $q->where('trainer_id', $user->id)->orWhere('student_id', $user->id);
            })->first();
    }

    public function join(int $bookingId): JsonResponse
    {
        $booking = $this->bookingForUser($bookingId);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        DB::table('session_rooms')->updateOrInsert(
            ['booking_id' => $bookingId],
            [
                'room_token' => Str::random(40),
                'status' => 'live',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $room = DB::table('session_rooms')->where('booking_id', $bookingId)->first();
        return response()->json(['success' => true, 'message' => 'Session joined', 'data' => $room]);
    }

    public function status(int $bookingId): JsonResponse
    {
        $booking = $this->bookingForUser($bookingId);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        $room = DB::table('session_rooms')->where('booking_id', $bookingId)->first();
        return response()->json(['success' => true, 'message' => 'Session status retrieved', 'data' => $room ?: ['status' => 'waiting']]);
    }

    public function end(int $bookingId): JsonResponse
    {
        $booking = DB::table('bookings')->where('id', $bookingId)->where('trainer_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        DB::table('session_rooms')
            ->where('booking_id', $bookingId)
            ->update(['status' => 'ended', 'ended_at' => now(), 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Session ended', 'data' => null]);
    }

    public function recording(int $bookingId): JsonResponse
    {
        $booking = $this->bookingForUser($bookingId);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        $room = DB::table('session_rooms')->where('booking_id', $bookingId)->first();
        return response()->json([
            'success' => true,
            'message' => 'Recording info retrieved',
            'data' => ['recording_url' => $room->recording_url ?? null],
        ]);
    }
}
