<?php

namespace App\Http\Controllers;

use App\Models\TaskCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskCategoryController extends Controller
{
    /**
     * Create a new task category
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', TaskCategory::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:task_categories',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'icon' => 'nullable|string|max:50',
        ]);

        $category = TaskCategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $this->formatCategory($category),
        ], 201);
    }

    /**
     * Get list of categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = TaskCategory::query();

        // Pagination
        $perPage = min($request->get('per_page', 50), 100);
        $categories = $query->withCount('tasks')
            ->orderBy('order')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'data' => $categories->map(fn($cat) => $this->formatCategoryWithCount($cat)),
            'pagination' => [
                'current_page' => $categories->currentPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'last_page' => $categories->lastPage(),
            ],
        ]);
    }

    /**
     * Get category details
     */
    public function show(TaskCategory $category): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Category retrieved successfully',
            'data' => $this->formatCategoryWithCount($category),
        ]);
    }

    /**
     * Update a category
     */
    public function update(Request $request, TaskCategory $category): JsonResponse
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:task_categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|regex:/^#[0-9A-F]{6}$/i',
            'icon' => 'nullable|string|max:50',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $this->formatCategory($category),
        ]);
    }

    /**
     * Delete a category
     */
    public function destroy(TaskCategory $category): JsonResponse
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    /**
     * Format category for response
     */
    private function formatCategory(TaskCategory $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'color' => $category->color,
            'icon' => $category->icon,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
        ];
    }

    /**
     * Format category with task count
     */
    private function formatCategoryWithCount(TaskCategory $category): array
    {
        return [
            ...$this->formatCategory($category),
            'task_count' => $category->tasks_count,
        ];
    }
}
