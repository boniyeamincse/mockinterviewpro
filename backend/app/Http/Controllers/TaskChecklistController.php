<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskChecklistItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class TaskChecklistController extends Controller
{
    /**
     * Add checklist item to task
     */
    public function store(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer|min:1',
        ]);

        $item = $task->checklistItems()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Checklist item added successfully',
            'data' => $this->formatChecklistItem($item),
        ], 201);
    }

    /**
     * Update checklist item
     */
    public function update(Request $request, Task $task, TaskChecklistItem $item): JsonResponse
    {
        $this->authorizeTask($task);

        if ($item->task_id !== $task->id) {
            abort(404, 'Checklist item not found');
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:1',
        ]);

        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Checklist item updated',
            'data' => $this->formatChecklistItem($item),
        ]);
    }

    /**
     * Delete checklist item
     */
    public function destroy(Task $task, TaskChecklistItem $item): JsonResponse
    {
        $this->authorizeTask($task);

        if ($item->task_id !== $task->id) {
            abort(404, 'Checklist item not found');
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Checklist item deleted',
        ]);
    }

    /**
     * Format checklist item
     */
    private function formatChecklistItem(TaskChecklistItem $item): array
    {
        return [
            'id' => $item->id,
            'task_id' => $item->task_id,
            'title' => $item->title,
            'completed' => $item->completed,
            'order' => $item->order,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
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
