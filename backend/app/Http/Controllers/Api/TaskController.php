<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    /**
     * Get all tasks for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::forUser(auth()->id());

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->query('status'));
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->byPriority($request->query('priority'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->byType($request->query('type'));
        }

        // Filter overdue
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Filter upcoming
        if ($request->boolean('upcoming')) {
            $query->upcoming($request->query('days', 7));
        }

        // Sort options
        $sortBy = $request->query('sort_by', 'due_date');
        $sortOrder = $request->query('sort_order', 'asc');

        if ($sortBy === 'priority') {
            $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') $sortOrder");
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tasks = $query->with(['creator', 'assignee'])->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $tasks,
            'message' => 'Tasks retrieved successfully',
        ]);
    }

    /**
     * Create a new task
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => 'required|in:low,medium,high',
            'type' => 'required|in:prep,session_planning,admin,general',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $task = Task::create([
            'user_id' => auth()->id(),
            ...$validated,
        ]);

        return response()->json([
            'success' => true,
            'data' => $task->load(['creator', 'assignee']),
            'message' => 'Task created successfully',
        ], 201);
    }

    /**
     * Get a specific task
     */
    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return response()->json([
            'success' => true,
            'data' => $task->load(['creator', 'assignee']),
            'message' => 'Task retrieved successfully',
        ]);
    }

    /**
     * Update a task
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'type' => 'nullable|in:prep,session_planning,admin,general',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'data' => $task->load(['creator', 'assignee']),
            'message' => 'Task updated successfully',
        ]);
    }

    /**
     * Delete a task (soft delete)
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

    /**
     * Toggle task status
     */
    public function toggleStatus(Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $statusFlow = [
            'pending' => 'in_progress',
            'in_progress' => 'completed',
            'completed' => 'pending',
            'cancelled' => 'pending',
        ];

        $task->update([
            'status' => $statusFlow[$task->status] ?? 'pending',
        ]);

        return response()->json([
            'success' => true,
            'data' => $task->load(['creator', 'assignee']),
            'message' => 'Task status updated',
        ]);
    }

    /**
     * Get task statistics
     */
    public function statistics(): JsonResponse
    {
        $userId = auth()->id();

        $stats = [
            'total' => Task::forUser($userId)->count(),
            'pending' => Task::forUser($userId)->byStatus('pending')->count(),
            'in_progress' => Task::forUser($userId)->byStatus('in_progress')->count(),
            'completed' => Task::forUser($userId)->byStatus('completed')->count(),
            'cancelled' => Task::forUser($userId)->byStatus('cancelled')->count(),
            'overdue' => Task::forUser($userId)->overdue()->count(),
            'by_priority' => [
                'high' => Task::forUser($userId)->byPriority('high')->count(),
                'medium' => Task::forUser($userId)->byPriority('medium')->count(),
                'low' => Task::forUser($userId)->byPriority('low')->count(),
            ],
            'by_type' => [
                'prep' => Task::forUser($userId)->byType('prep')->count(),
                'session_planning' => Task::forUser($userId)->byType('session_planning')->count(),
                'admin' => Task::forUser($userId)->byType('admin')->count(),
                'general' => Task::forUser($userId)->byType('general')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Statistics retrieved successfully',
        ]);
    }

    /**
     * Reorder tasks (bulk update)
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.order' => 'required|integer',
        ]);

        foreach ($validated['tasks'] as $taskData) {
            $task = Task::find($taskData['id']);
            $this->authorize('update', $task);
            $task->update(['order' => $taskData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tasks reordered successfully',
        ]);
    }

    /**
     * Bulk update task status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        Task::whereIn('id', $validated['task_ids'])
            ->where('user_id', auth()->id())
            ->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Tasks updated successfully',
        ]);
    }

    /**
     * Export tasks to CSV
     */
    public function export(Request $request): JsonResponse
    {
        $query = Task::forUser(auth()->id());

        if ($request->has('status')) {
            $query->byStatus($request->query('status'));
        }

        $tasks = $query->get(['id', 'title', 'priority', 'status', 'type', 'due_date', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $tasks,
            'message' => 'Tasks exported successfully',
        ]);
    }
}
