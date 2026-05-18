<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::query()->with('user');

        // Filters
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
            'description' => 'nullable|string|max:5000',
            'status' => 'nullable|in:draft,published,archived',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
        ]);

        $event = Event::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
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

        // Students can view only published events; owner/admin can view all.
        $user = Auth::user();
        if ($user && $user->isStudent() && $event->status !== 'published') {
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
            'description' => 'nullable|string|max:5000',
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
}

