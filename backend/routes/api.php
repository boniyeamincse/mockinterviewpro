<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCategoryController;
use App\Http\Controllers\TaskChecklistController;

// Auth endpoints
require base_path('routes/auth.php');

// Events API
use App\Http\Controllers\EventController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Task Routes
    Route::apiResource('tasks', TaskController::class);

    // Events Routes
    Route::apiResource('events', EventController::class)->except(['update']);
    Route::put('events/{event}/status', [EventController::class, 'updateStatus']);
    Route::put('events/{event}', [EventController::class, 'update']);



    // Task Progress
    Route::put('tasks/{task}/progress', [TaskController::class, 'updateProgress']);

    // Task Statistics
    Route::get('tasks/stats', [TaskController::class, 'getStats']);

    // Bulk Operations
    Route::post('tasks/bulk/update', [TaskController::class, 'bulkUpdate']);
    Route::post('tasks/bulk/delete', [TaskController::class, 'bulkDelete']);

    // Task Category Routes
    Route::apiResource('tasks/categories', TaskCategoryController::class)->except(['destroy']);

    // Task Checklist Routes
    Route::post('tasks/{task}/checklist', [TaskChecklistController::class, 'store']);
    Route::put('tasks/{task}/checklist/{item}', [TaskChecklistController::class, 'update']);
    Route::delete('tasks/{task}/checklist/{item}', [TaskChecklistController::class, 'destroy']);
});

// Public routes (if needed)
// Route::get('/health', function () {
//     return response()->json(['status' => 'ok']);
// });
