<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerAnalyticsController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isTrainer() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Trainer access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }
        return null;
    }

    public function overview(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $trainerId = Auth::id();
        $totalSessions = DB::table('bookings')->where('trainer_id', $trainerId)->count();
        $completed = DB::table('bookings')->where('trainer_id', $trainerId)->where('status', 'completed')->count();
        $avgRating = round((float) DB::table('reviews')->where('trainer_id', $trainerId)->avg('rating'), 2);
        $earnings = (int) DB::table('wallet_transactions')->where('user_id', $trainerId)->where('type', 'credit')->sum('amount_bdt');

        return response()->json(['success' => true, 'message' => 'Overview retrieved', 'data' => [
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completed,
            'completion_rate' => $totalSessions > 0 ? round(($completed / $totalSessions) * 100, 2) : 0,
            'avg_rating' => $avgRating,
            'total_earnings_bdt' => $earnings,
        ]]);
    }

    public function revenue(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $rows = DB::table('wallet_transactions')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount_bdt) as total')
            ->where('user_id', Auth::id())
            ->where('type', 'credit')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json(['success' => true, 'message' => 'Revenue analytics retrieved', 'data' => $rows]);
    }

    public function sessions(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $rows = DB::table('bookings')
            ->join('events', 'events.id', '=', 'bookings.event_id')
            ->where('bookings.trainer_id', Auth::id())
            ->selectRaw('events.category, COUNT(*) as total')
            ->groupBy('events.category')
            ->get();

        return response()->json(['success' => true, 'message' => 'Session analytics retrieved', 'data' => $rows]);
    }

    public function eventMetrics(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $event = DB::table('events')->where('id', $id)->where('user_id', Auth::id())->first();
        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found', 'code' => 'NOT_FOUND'], 404);
        }

        $bookings = DB::table('bookings')->where('event_id', $id)->count();
        $avgRating = round((float) DB::table('reviews')->where('event_id', $id)->avg('rating'), 2);

        return response()->json(['success' => true, 'message' => 'Event analytics retrieved', 'data' => [
            'event_id' => $id,
            'views' => 0,
            'bookings' => $bookings,
            'avg_rating' => $avgRating,
        ]]);
    }

    public function ratings(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $rows = DB::table('reviews')
            ->selectRaw('DATE(created_at) as day, AVG(rating) as avg_rating, COUNT(*) as count')
            ->where('trainer_id', Auth::id())
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return response()->json(['success' => true, 'message' => 'Rating trend retrieved', 'data' => $rows]);
    }
}
