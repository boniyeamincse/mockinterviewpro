<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentDiscoveryController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $queryText = (string) $request->get('q', '');

        $query = Event::query()->where('status', 'published')->with('user');

        if ($queryText !== '') {
            $query->where(function ($q) use ($queryText) {
                $q->where('title', 'like', "%{$queryText}%")
                    ->orWhere('description', 'like', "%{$queryText}%")
                    ->orWhere('topics_covered', 'like', "%{$queryText}%");
            });
        }

        return response()->json([
            'success' => true,
            'message' => 'Search results retrieved',
            'data' => $query->orderByDesc('created_at')->paginate(20),
        ]);
    }

    public function eventSlots(int $id): JsonResponse
    {
        $event = Event::where('id', $id)->where('status', 'published')->firstOrFail();

        $slots = DB::table('event_slots')
            ->where('event_id', $event->id)
            ->where('status', 'open')
            ->orderBy('starts_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Event slots retrieved',
            'data' => $slots,
        ]);
    }

    public function addWishlist(int $eventId): JsonResponse
    {
        $user = Auth::user();
        if (!$user || (!$user->isStudent() && !$user->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        $event = Event::findOrFail($eventId);
        DB::table('wishlists')->updateOrInsert(
            ['user_id' => $user->id, 'event_id' => $event->id],
            ['updated_at' => now(), 'created_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Event added to wishlist', 'data' => null], 201);
    }

    public function removeWishlist(int $eventId): JsonResponse
    {
        $user = Auth::user();
        if (!$user || (!$user->isStudent() && !$user->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        DB::table('wishlists')->where('user_id', $user->id)->where('event_id', $eventId)->delete();

        return response()->json(['success' => true, 'message' => 'Event removed from wishlist', 'data' => null]);
    }

    public function wishlist(): JsonResponse
    {
        $user = Auth::user();
        if (!$user || (!$user->isStudent() && !$user->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        $events = DB::table('wishlists')
            ->join('events', 'events.id', '=', 'wishlists.event_id')
            ->where('wishlists.user_id', $user->id)
            ->select('events.*', 'wishlists.created_at as wishlisted_at')
            ->orderByDesc('wishlists.id')
            ->paginate(20);

        return response()->json(['success' => true, 'message' => 'Wishlist retrieved', 'data' => $events]);
    }

    public function trainerProfile(int $id): JsonResponse
    {
        $trainer = DB::table('users')
            ->where('id', $id)
            ->where('user_type', 'trainer')
            ->select('id', 'name', 'bio', 'profile_image', 'expertise', 'experience_years', 'linkedin_url', 'website_url')
            ->first();

        if (!$trainer) {
            return response()->json(['success' => false, 'message' => 'Trainer not found', 'code' => 'NOT_FOUND'], 404);
        }

        $avgRating = round((float) DB::table('reviews')->where('trainer_id', $id)->avg('rating'), 2);
        $reviewCount = DB::table('reviews')->where('trainer_id', $id)->count();

        return response()->json([
            'success' => true,
            'message' => 'Trainer profile retrieved',
            'data' => [
                ... (array) $trainer,
                'avg_rating' => $avgRating,
                'review_count' => $reviewCount,
            ],
        ]);
    }

    public function trainerReviews(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Trainer reviews retrieved',
            'data' => DB::table('reviews')
                ->where('trainer_id', $id)
                ->orderByDesc('id')
                ->paginate(20),
        ]);
    }
}
