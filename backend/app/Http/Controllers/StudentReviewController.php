<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentReviewController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isStudent() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        return null;
    }

    public function store(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'booking_id' => 'nullable|integer|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $event = DB::table('events')->where('id', $validated['event_id'])->first();

        $id = DB::table('reviews')->insertGetId([
            'event_id' => $event->id,
            'booking_id' => $validated['booking_id'] ?? null,
            'trainer_id' => $event->user_id,
            'student_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Review submitted', 'data' => DB::table('reviews')->where('id', $id)->first()], 201);
    }

    public function index(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Student reviews retrieved',
            'data' => DB::table('reviews')->where('student_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $review = DB::table('reviews')->where('id', $id)->where('student_id', Auth::id())->first();
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found', 'code' => 'NOT_FOUND'], 404);
        }

        if (!empty($review->trainer_reply)) {
            return response()->json(['success' => false, 'message' => 'Cannot edit after trainer reply', 'code' => 'REVIEW_LOCKED'], 422);
        }

        DB::table('reviews')->where('id', $id)->update([...$validated, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Review updated', 'data' => DB::table('reviews')->where('id', $id)->first()]);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $deleted = DB::table('reviews')->where('id', $id)->where('student_id', Auth::id())->delete();
        if (!$deleted) {
            return response()->json(['success' => false, 'message' => 'Review not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Review deleted', 'data' => null]);
    }

    public function report(Request $request, int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate(['reason' => 'nullable|string|max:1000']);

        $review = DB::table('reviews')->where('id', $id)->first();
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found', 'code' => 'NOT_FOUND'], 404);
        }

        DB::table('review_reports')->updateOrInsert(
            ['review_id' => $review->id, 'student_id' => Auth::id()],
            ['reason' => $validated['reason'] ?? null, 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Review reported', 'data' => null], 201);
    }
}
