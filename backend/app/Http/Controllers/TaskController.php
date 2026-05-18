<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Create a new task
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|min:3',
            'description' => 'nullable|string|max:5000',
            'category_id' => 'nullable|exists:task_categories,id',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date|after_or_equal:today',
            'session_id' => 'nullable|exists:sessions,id',
            'estimated_hours' => 'nullable|numeric|min:0.5|max:1000',
            'status' => 'nullable|in:pending,in_progress,completed',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
        ]);

        $task = Auth::user()->tasks()->create([
            ...$validated,
            'priority' => $validated['priority'] ?? 'medium',
            'status' => $validated['status'] ?? 'pending',
            'progress_percentage' => 0,
        ]);

        // Add tags if provided
        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tag) {
                $task->tags()->create(['tag' => $tag]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $this->formatTask($task),
        ], 201);
    }

    /**
     * Get list of tasks with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::query();

        // Filter by user
        if ($request->boolean('my_tasks')) {
            $query->where('user_id', Auth::id());
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('priority')) {
            $query->byPriority($request->priority);
        }

        if ($request->filled('category_id')) {
            $query->byCategory($request->category_id);
        }

        if ($request->filled('session_id')) {
            $query->bySession($request->session_id);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $tasks = $query->with(['category', 'checklistItems', 'tags'])
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks->map(fn($task) => $this->formatTask($task)),
            'pagination' => [
                'current_page' => $tasks->currentPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
                'last_page' => $tasks->lastPage(),
            ],
        ]);
    }

    /**
     * Get task details
     */
    public function show(Task $task): JsonResponse
    {
        $this->authorizeTask($task);

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully',
            'data' => $this->formatTaskWithDetails($task),
        ]);
    }

    /**
     * Update a task
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($task);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255|min:3',
            'description' => 'nullable|string|max:5000',
            'category_id' => 'nullable|exists:task_categories,id',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date|after_or_equal:today',
            'estimated_hours' => 'nullable|numeric|min:0.5|max:1000',
            'status' => 'nullable|in:pending,in_progress,completed',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'string|max:50',
        ]);

        $task->update($validated);

        // Update tags if provided
        if (isset($validated['tags'])) {
            $task->tags()->delete();
            foreach ($validated['tags'] as $tag) {
                $task->tags()->create(['tag' => $tag]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $this->formatTask($task),
        ]);
    }

    /**
     * Delete a task
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorizeTask($task);

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

    /**
     * Bulk update tasks
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
            'status' => 'nullable|in:pending,in_progress,completed',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $updated = 0;
        foreach ($validated['task_ids'] as $taskId) {
            $task = Task::find($taskId);
            if ($task && $task->user_id == Auth::id()) {
                $task->update(array_filter($validated, fn($k) => in_array($k, ['status', 'priority']), ARRAY_FILTER_USE_KEY));
                $updated++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "{$updated} tasks updated successfully",
            'data' => ['updated' => $updated],
        ]);
    }

    /**
     * Bulk delete tasks
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        $deleted = Task::whereIn('id', $validated['task_ids'])
            ->where('user_id', Auth::id())
            ->delete();

        return response()->json([
            'success' => true,
            'message' => "{$deleted} tasks deleted successfully",
            'data' => ['deleted' => $deleted],
        ]);
    }

    /**
     * Update task progress
     */
    public function updateProgress(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($task);

        $validated = $request->validate([
            'progress_percentage' => 'required|integer|min:0|max:100',
            'actual_hours' => 'nullable|numeric|min:0|max:1000',
            'notes' => 'nullable|string',
        ]);

        $task->updateProgress($validated['progress_percentage'], $validated['actual_hours'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Progress updated successfully',
            'data' => $this->formatTask($task),
        ]);
    }

    /**
     * Get task statistics
     */
    public function getStats(Request $request): JsonResponse
    {
        $query = Task::where('user_id', Auth::id());

        if ($request->filled('session_id')) {
            $query->bySession($request->session_id);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to,
            ]);
        }

        $tasks = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Stats retrieved successfully',
            'data' => [
                'total_tasks' => $tasks->count(),
                'pending_tasks' => $tasks->where('status', 'pending')->count(),
                'in_progress_tasks' => $tasks->where('status', 'in_progress')->count(),
                'completed_tasks' => $tasks->where('status', 'completed')->count(),
                'total_hours' => $tasks->sum('estimated_hours'),
                'completed_hours' => $tasks->where('status', 'completed')->sum('actual_hours'),
                'average_completion_rate' => round($tasks->avg('progress_percentage'), 1),
                'high_priority_tasks' => $tasks->where('priority', 'high')->count(),
                'overdue_tasks' => $tasks->where('due_date', '<', now())->where('status', '!=', 'completed')->count(),
                'tasks_due_today' => $tasks->whereDate('due_date', today())->where('status', '!=', 'completed')->count(),
                'tasks_due_this_week' => $tasks->whereBetween('due_date', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ])->where('status', '!=', 'completed')->count(),
            ],
        ]);
    }

    /**
     * Format task for API response
     */
    private function formatTask(Task $task): array
    {
        return [
            'id' => $task->id,
            'user_id' => $task->user_id,
            'title' => $task->title,
            'description' => $task->description,
            'category_id' => $task->category_id,
            'priority' => $task->priority,
            'due_date' => $task->due_date?->format('Y-m-d'),
            'session_id' => $task->session_id,
            'estimated_hours' => $task->estimated_hours,
            'actual_hours' => $task->actual_hours,
            'status' => $task->status,
            'progress_percentage' => $task->progress_percentage,
            'tags' => $task->tags->pluck('tag')->toArray(),
            'created_at' => $task->created_at,
            'updated_at' => $task->updated_at,
        ];
    }

    /**
     * Format task with details for show endpoint
     */
    private function formatTaskWithDetails(Task $task): array
    {
        return [
            ...$this->formatTask($task),
            'checklist_items' => $task->checklistItems->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'completed' => $item->completed,
                'order' => $item->order,
            ])->toArray(),
            'attachments' => $task->attachments->map(fn($attachment) => [
                'id' => $attachment->id,
                'filename' => $attachment->filename,
                'url' => $attachment->file_url,
                'size' => $attachment->formatted_size,
                'uploaded_at' => $attachment->created_at,
            ])->toArray(),
            'completed_at' => $task->completed_at,
        ];
    }

    /**
     * Authorize task access
     */
    private function authorizeTask(Task $task): void
    {
        if ($task->user_id !== Auth::id() && !Auth::user()->is_admin) {
            abort(403, 'Unauthorized to access this task');
        }
    }
}
