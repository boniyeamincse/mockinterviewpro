<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCategoryController;
use App\Http\Controllers\TaskChecklistController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TrainerEventController;
use App\Http\Controllers\TrainerBookingController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TrainerWalletController;
use App\Http\Controllers\TrainerReviewController;
use App\Http\Controllers\TrainerAnalyticsController;
use App\Http\Controllers\TrainerNotificationController;
use App\Http\Controllers\TrainerProfileController;

// Auth endpoints
require base_path('routes/auth.php');

Route::middleware(['auth:sanctum'])->group(function () {
    // Task Routes
    Route::apiResource('tasks', TaskController::class);

    // Events Routes
    Route::apiResource('events', EventController::class)->except(['update']);
    Route::put('events/{event}/status', [EventController::class, 'updateStatus']);
    Route::put('events/{event}', [EventController::class, 'update']);

    // Trainer Module 01 + 01b: Events and Availability
    Route::post('trainer/events', [TrainerEventController::class, 'store']);
    Route::get('trainer/events', [TrainerEventController::class, 'index']);
    Route::get('trainer/events/{id}', [TrainerEventController::class, 'show']);
    Route::put('trainer/events/{id}', [TrainerEventController::class, 'update']);
    Route::patch('trainer/events/{id}/publish', [TrainerEventController::class, 'publish']);
    Route::patch('trainer/events/{id}/unpublish', [TrainerEventController::class, 'unpublish']);
    Route::delete('trainer/events/{id}', [TrainerEventController::class, 'destroy']);
    Route::post('trainer/events/{id}/slots', [TrainerEventController::class, 'addSlots']);
    Route::get('trainer/events/{id}/slots', [TrainerEventController::class, 'listSlots']);
    Route::delete('trainer/slots/{slotId}', [TrainerEventController::class, 'deleteSlot']);
    Route::post('trainer/availability/block', [TrainerEventController::class, 'blockAvailability']);
    Route::delete('trainer/availability/block/{id}', [TrainerEventController::class, 'unblockAvailability']);

    // Trainer Module 03: Bookings
    Route::get('trainer/bookings', [TrainerBookingController::class, 'index']);
    Route::get('trainer/bookings/today', [TrainerBookingController::class, 'today']);
    Route::get('trainer/bookings/{bookingId}', [TrainerBookingController::class, 'show']);
    Route::patch('trainer/bookings/{id}/cancel', [TrainerBookingController::class, 'cancel']);
    Route::patch('trainer/bookings/{id}/complete', [TrainerBookingController::class, 'complete']);

    // Trainer Module 04: Sessions
    Route::post('sessions/{bookingId}/join', [SessionController::class, 'join']);
    Route::get('sessions/{bookingId}/status', [SessionController::class, 'status']);
    Route::post('sessions/{bookingId}/end', [SessionController::class, 'end']);
    Route::get('sessions/{bookingId}/recording', [SessionController::class, 'recording']);

    // Trainer Module 05: Wallet
    Route::get('trainer/wallet', [TrainerWalletController::class, 'wallet']);
    Route::get('trainer/wallet/transactions', [TrainerWalletController::class, 'transactions']);
    Route::post('trainer/wallet/withdraw', [TrainerWalletController::class, 'withdraw']);
    Route::get('trainer/wallet/withdrawals', [TrainerWalletController::class, 'withdrawals']);
    Route::post('trainer/bank-account', [TrainerWalletController::class, 'saveBankAccount']);
    Route::get('trainer/bank-account', [TrainerWalletController::class, 'getBankAccount']);

    // Trainer Module 06: Reviews
    Route::get('trainer/reviews', [TrainerReviewController::class, 'index']);
    Route::post('trainer/reviews/{reviewId}/reply', [TrainerReviewController::class, 'reply']);
    Route::put('trainer/reviews/{reviewId}/reply', [TrainerReviewController::class, 'updateReply']);

    // Trainer Module 07: Analytics
    Route::get('trainer/analytics/overview', [TrainerAnalyticsController::class, 'overview']);
    Route::get('trainer/analytics/revenue', [TrainerAnalyticsController::class, 'revenue']);
    Route::get('trainer/analytics/sessions', [TrainerAnalyticsController::class, 'sessions']);
    Route::get('trainer/analytics/events/{id}', [TrainerAnalyticsController::class, 'eventMetrics']);
    Route::get('trainer/analytics/ratings', [TrainerAnalyticsController::class, 'ratings']);

    // Trainer Module 08: Notifications
    Route::get('trainer/notifications', [TrainerNotificationController::class, 'index']);
    Route::patch('trainer/notifications/{id}/read', [TrainerNotificationController::class, 'read']);
    Route::patch('trainer/notifications/read-all', [TrainerNotificationController::class, 'readAll']);
    Route::put('trainer/notifications/preferences', [TrainerNotificationController::class, 'updatePreferences']);

    // Trainer profile endpoints
    Route::get('trainer/profile', [TrainerProfileController::class, 'show']);
    Route::put('trainer/profile', [TrainerProfileController::class, 'update']);
    Route::patch('trainer/profile/password', [TrainerProfileController::class, 'changePassword']);

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
