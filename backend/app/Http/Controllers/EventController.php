<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    private const EVENT_CATEGORIES = [
        'software_engineering',
        'data_science',
        'product_design',
        'product_management',
        'finance',
        'consulting',
        'marketing',
        'devops',
        'healthcare',
        'law',
        'academia',
        'general',
    ];

    private const INTERVIEW_TYPES = [
        'technical',
        'behavioral',
        'case_study',
        'hr',
        'mixed',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Event::query()->with('user');
        $user = Auth::user();

        // Guest and students can only browse published events.
        if (!$user || $user->isStudent()) {
            $query->published();
        }

        if ($request->boolean('mine') && $user) {
            $query->forTrainer($user->id);
        }

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('interview_type')) {
            $query->where('interview_type', $request->string('interview_type'));
        }

        if ($request->filled('min_price')) {
            $query->where('price_bdt', '>=', (int) $request->get('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price_bdt', '<=', (int) $request->get('max_price'));
        }

        if ($request->filled('language')) {
            $query->where('language', $request->string('language'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('starts_from')) {
            $query->where('starts_at', '>=', $request->string('starts_from'));
        }

        if ($request->filled('ends_to')) {
            $query->where('ends_at', '<=', $request->string('ends_to'));
        }

        // Pagination
        $perPage = min((int) $request->get('per_page', 15), 100);
        $events = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Events retrieved successfully',
            'data' => $events,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user->hasPermission('create_events')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to create events',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:' . implode(',', self::EVENT_CATEGORIES),
            'interview_type' => 'required|in:' . implode(',', self::INTERVIEW_TYPES),
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
            'available_slots' => 'required|array|min:1',
            'available_slots.*' => 'date',
            'blocked_dates' => 'nullable|array',
            'blocked_dates.*' => 'date',
            'timezone' => 'required|timezone',
            'slot_buffer_minutes' => 'nullable|integer|min:0|max:180',
            'advance_notice_hours' => 'nullable|integer|min:0|max:168',
            'status' => 'nullable|in:draft,published,archived',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
        ]);

        $event = Event::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'interview_type' => $validated['interview_type'],
            'description' => $validated['description'],
            'topics_covered' => $validated['topics_covered'],
            'process_overview' => $validated['process_overview'] ?? null,
            'language' => $validated['language'] ?? 'Bangla + English',
            'sample_questions' => $validated['sample_questions'] ?? [],
            'total_sessions' => $validated['total_sessions'],
            'duration_minutes' => $validated['duration_minutes'],
            'price_bdt' => $validated['price_bdt'],
            'cancellation_policy' => $validated['cancellation_policy'],
            'reschedule_policy' => $validated['reschedule_policy'] ?? null,
            'available_slots' => $validated['available_slots'],
            'blocked_dates' => $validated['blocked_dates'] ?? [],
            'timezone' => $validated['timezone'],
            'slot_buffer_minutes' => $validated['slot_buffer_minutes'] ?? 15,
            'advance_notice_hours' => $validated['advance_notice_hours'] ?? 24,
            'status' => $validated['status'] ?? 'draft',
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
        ]);

        if ($event->status === 'published') {
            $event->published_at = now();
            $event->save();
        }

        if ($event->status === 'archived') {
            $event->archived_at = now();
            $event->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event,
        ], 201);
    }

    public function show(int|string $id): JsonResponse
    {
        $event = Event::with('user')->findOrFail($id);

        // Guests and students can view only published events; owner/admin can view all.
        $user = Auth::user();
        if ((!$user || $user->isStudent()) && $event->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Event not available',
                'code' => 'NOT_FOUND',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event retrieved successfully',
            'data' => $event,
        ]);
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $user = Auth::user();

        if (!$user->isAdmin() && $event->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this event',
                'code' => 'UNAUTHORIZED',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:' . implode(',', self::EVENT_CATEGORIES),
            'interview_type' => 'sometimes|required|in:' . implode(',', self::INTERVIEW_TYPES),
            'description' => 'nullable|string|max:5000',
            'topics_covered' => 'sometimes|required|array|min:1',
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
            'available_slots' => 'sometimes|required|array|min:1',
            'available_slots.*' => 'date',
            'blocked_dates' => 'nullable|array',
            'blocked_dates.*' => 'date',
            'timezone' => 'nullable|timezone',
            'slot_buffer_minutes' => 'nullable|integer|min:0|max:180',
            'advance_notice_hours' => 'nullable|integer|min:0|max:168',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event,
        ]);
    }

    // Status transitions endpoint (draft/published/archived)
    public function updateStatus(Request $request, int|string $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $user = Auth::user();

        if (!$user->hasPermission('create_events') && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update event status',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        if (!$user->isAdmin() && $event->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this event',
                'code' => 'UNAUTHORIZED',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:draft,published,archived',
        ]);

        $event->status = $validated['status'];

        if ($event->status === 'published') {
            $event->published_at = now();
            $event->archived_at = null;
        }

        if ($event->status === 'archived') {
            $event->archived_at = now();
        }

        if ($event->status === 'draft') {
            $event->published_at = null;
            $event->archived_at = null;
        }

        $event->save();

        return response()->json([
            'success' => true,
            'message' => 'Event status updated successfully',
            'data' => $event,
        ]);
    }

    public function destroy(int|string $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $user = Auth::user();

        if (!$user->isAdmin() && $event->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this event',
                'code' => 'UNAUTHORIZED',
            ], 403);
        }

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
            'data' => null,
        ]);
    }

    public function myEvents(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isTrainer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers can access this endpoint',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        $query = Event::query()->with('user')->forTrainer($user->id);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->get('per_page', 15), 100);

        return response()->json([
            'success' => true,
            'message' => 'Trainer events retrieved successfully',
            'data' => $query->orderByDesc('created_at')->paginate($perPage),
        ]);
    }

    public function trainerStats(): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isTrainer() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers can access this endpoint',
                'code' => 'INSUFFICIENT_PERMISSIONS',
            ], 403);
        }

        $events = Event::query()->forTrainer($user->id);

        $total = (clone $events)->count();
        $draft = (clone $events)->where('status', 'draft')->count();
        $published = (clone $events)->where('status', 'published')->count();
        $archived = (clone $events)->where('status', 'archived')->count();
        $plannedSessions = (clone $events)->sum('total_sessions');
        $projectedRevenueBdt = (clone $events)->selectRaw('COALESCE(SUM(price_bdt * total_sessions), 0) as total')->value('total');
        $trainerShareBdt = (int) floor($projectedRevenueBdt * 0.85);

        return response()->json([
            'success' => true,
            'message' => 'Trainer event stats retrieved successfully',
            'data' => [
                'total_events' => $total,
                'draft_events' => $draft,
                'published_events' => $published,
                'archived_events' => $archived,
                'planned_sessions' => $plannedSessions,
                'projected_revenue_bdt' => (int) $projectedRevenueBdt,
                'trainer_share_bdt' => $trainerShareBdt,
            ],
        ]);
    }
}

