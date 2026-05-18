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
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\StudentDiscoveryController;
use App\Http\Controllers\StudentBookingController;
use App\Http\Controllers\StudentPaymentController;
use App\Http\Controllers\StudentReviewController;
use App\Http\Controllers\StudentNotificationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MultiDayEventController;
use App\Http\Controllers\MultiDayBookingController;
use App\Http\Controllers\MultiDaySessionController;

// Auth endpoints
require base_path('routes/auth.php');

// Public student discovery endpoints
Route::get('events', [EventController::class, 'index']);
Route::get('events/search', [StudentDiscoveryController::class, 'search']);
Route::get('events/{id}/slots', [StudentDiscoveryController::class, 'eventSlots']);
Route::get('events/{event}', [EventController::class, 'show']);
Route::get('trainers', [StudentDiscoveryController::class, 'trainers']);
Route::get('trainers/{id}/profile', [StudentDiscoveryController::class, 'trainerProfile']);
Route::get('trainers/{id}/reviews', [StudentDiscoveryController::class, 'trainerReviews']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Task Routes
    Route::apiResource('tasks', TaskController::class);

    // Events Routes
    Route::apiResource('events', EventController::class)->except(['index', 'show', 'update']);
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

    // Student profile endpoints
    Route::get('student/profile', [StudentProfileController::class, 'show']);
    Route::put('student/profile', [StudentProfileController::class, 'update']);
    Route::patch('student/profile/password', [StudentProfileController::class, 'changePassword']);

    // Student discovery and wishlist
    Route::post('student/wishlist/{eventId}', [StudentDiscoveryController::class, 'addWishlist']);
    Route::delete('student/wishlist/{eventId}', [StudentDiscoveryController::class, 'removeWishlist']);
    Route::get('student/wishlist', [StudentDiscoveryController::class, 'wishlist']);

    // Student bookings
    Route::post('student/bookings', [StudentBookingController::class, 'store']);
    Route::get('student/bookings', [StudentBookingController::class, 'index']);
    Route::get('student/bookings/upcoming', [StudentBookingController::class, 'upcoming']);
    Route::get('student/bookings/{id}', [StudentBookingController::class, 'show']);
    Route::patch('student/bookings/{id}/cancel', [StudentBookingController::class, 'cancel']);
    Route::patch('student/bookings/{id}/reschedule', [StudentBookingController::class, 'reschedule']);

    // Student payments
    Route::post('student/payments/initiate', [StudentPaymentController::class, 'initiate']);
    Route::post('student/payments/verify', [StudentPaymentController::class, 'verify']);
    Route::get('student/payments', [StudentPaymentController::class, 'index']);
    Route::get('student/payments/{id}', [StudentPaymentController::class, 'show']);
    Route::get('student/payments/{id}/receipt', [StudentPaymentController::class, 'receipt']);

    // Student reviews
    Route::post('student/reviews', [StudentReviewController::class, 'store']);
    Route::get('student/reviews', [StudentReviewController::class, 'index']);
    Route::put('student/reviews/{id}', [StudentReviewController::class, 'update']);
    Route::delete('student/reviews/{id}', [StudentReviewController::class, 'destroy']);
    Route::post('student/reviews/{id}/report', [StudentReviewController::class, 'report']);

    // Student notifications
    Route::get('student/notifications', [StudentNotificationController::class, 'index']);
    Route::patch('student/notifications/{id}/read', [StudentNotificationController::class, 'read']);
    Route::patch('student/notifications/read-all', [StudentNotificationController::class, 'readAll']);
    Route::put('student/notifications/preferences', [StudentNotificationController::class, 'updatePreferences']);

    // Admin account
    Route::get('admin/me', [AdminController::class, 'me']);
    Route::patch('admin/me/password', [AdminController::class, 'changeMyPassword']);

    // Admin trainer management
    Route::get('admin/trainers', [AdminController::class, 'trainers']);
    Route::get('admin/trainers/pending', [AdminController::class, 'pendingTrainers']);
    Route::get('admin/trainers/{id}', [AdminController::class, 'trainer']);
    Route::patch('admin/trainers/{id}/approve', [AdminController::class, 'approveTrainer']);
    Route::patch('admin/trainers/{id}/suspend', [AdminController::class, 'suspendTrainer']);
    Route::patch('admin/trainers/{id}/reinstate', [AdminController::class, 'reinstateTrainer']);
    Route::delete('admin/trainers/{id}', [AdminController::class, 'deleteTrainer']);
    Route::post('admin/trainers/{id}/note', [AdminController::class, 'noteTrainer']);

    // Admin student management
    Route::get('admin/students', [AdminController::class, 'students']);
    Route::get('admin/students/{id}', [AdminController::class, 'student']);
    Route::patch('admin/students/{id}/suspend', [AdminController::class, 'suspendStudent']);
    Route::patch('admin/students/{id}/reinstate', [AdminController::class, 'reinstateStudent']);
    Route::delete('admin/students/{id}', [AdminController::class, 'deleteStudent']);
    Route::post('admin/students/{id}/note', [AdminController::class, 'noteStudent']);

    // Admin event management
    Route::get('admin/events', [AdminController::class, 'events']);
    Route::get('admin/events/flagged', [AdminController::class, 'flaggedEvents']);
    Route::get('admin/events/{id}', [AdminController::class, 'event']);
    Route::patch('admin/events/{id}/unpublish', [AdminController::class, 'unpublishEvent']);
    Route::patch('admin/events/{id}/publish', [AdminController::class, 'publishEvent']);
    Route::patch('admin/events/{id}/flag', [AdminController::class, 'flagEvent']);
    Route::delete('admin/events/{id}', [AdminController::class, 'deleteEvent']);

    // Admin booking oversight
    Route::get('admin/bookings', [AdminController::class, 'bookings']);
    Route::get('admin/bookings/disputed', [AdminController::class, 'disputedBookings']);
    Route::get('admin/bookings/{id}', [AdminController::class, 'booking']);
    Route::patch('admin/bookings/{id}/cancel', [AdminController::class, 'cancelBooking']);
    Route::patch('admin/bookings/{id}/complete', [AdminController::class, 'completeBooking']);
    Route::post('admin/bookings/{id}/note', [AdminController::class, 'noteBooking']);

    // Admin payments and finance
    Route::get('admin/payments', [AdminController::class, 'payments']);
    Route::get('admin/payments/{id}', [AdminController::class, 'payment']);
    Route::post('admin/payments/{id}/refund', [AdminController::class, 'refundPayment']);
    Route::get('admin/withdrawals', [AdminController::class, 'withdrawals']);
    Route::get('admin/withdrawals/pending', [AdminController::class, 'pendingWithdrawals']);
    Route::patch('admin/withdrawals/{id}/approve', [AdminController::class, 'approveWithdrawal']);
    Route::patch('admin/withdrawals/{id}/reject', [AdminController::class, 'rejectWithdrawal']);
    Route::get('admin/wallets', [AdminController::class, 'wallets']);
    Route::get('admin/wallets/company', [AdminController::class, 'companyWallet']);
    Route::get('admin/finance/summary', [AdminController::class, 'financeSummary']);

    // Admin review moderation
    Route::get('admin/reviews', [AdminController::class, 'reviews']);
    Route::get('admin/reviews/flagged', [AdminController::class, 'flaggedReviews']);
    Route::get('admin/reviews/{id}', [AdminController::class, 'review']);
    Route::delete('admin/reviews/{id}', [AdminController::class, 'deleteReview']);
    Route::delete('admin/reviews/{id}/reply', [AdminController::class, 'deleteReviewReply']);
    Route::patch('admin/reviews/{id}/clear-flag', [AdminController::class, 'clearReviewFlag']);

    // Admin analytics
    Route::get('admin/analytics/overview', [AdminController::class, 'analyticsOverview']);
    Route::get('admin/analytics/revenue', [AdminController::class, 'analyticsRevenue']);
    Route::get('admin/analytics/sessions', [AdminController::class, 'analyticsSessions']);
    Route::get('admin/analytics/users', [AdminController::class, 'analyticsUsers']);
    Route::get('admin/analytics/categories', [AdminController::class, 'analyticsCategories']);
    Route::get('admin/analytics/top-trainers', [AdminController::class, 'analyticsTopTrainers']);
    Route::get('admin/analytics/retention', [AdminController::class, 'analyticsRetention']);
    Route::get('admin/analytics/export', [AdminController::class, 'analyticsExport']);

    // Admin notifications and broadcast
    Route::get('admin/notifications', [AdminController::class, 'notifications']);
    Route::patch('admin/notifications/read-all', [AdminController::class, 'notificationsReadAll']);
    Route::post('admin/broadcast', [AdminController::class, 'broadcast']);
    Route::get('admin/broadcast/history', [AdminController::class, 'broadcastHistory']);
    Route::post('admin/notifications/email', [AdminController::class, 'sendEmail']);
    Route::get('admin/notifications/logs', [AdminController::class, 'notificationLogs']);

    // Admin platform settings
    Route::get('admin/settings', [AdminController::class, 'settings']);
    Route::put('admin/settings/commission', [AdminController::class, 'setCommission']);
    Route::put('admin/settings/min-price', [AdminController::class, 'setMinPrice']);
    Route::put('admin/settings/categories', [AdminController::class, 'setCategories']);
    Route::put('admin/settings/cancellation-policy', [AdminController::class, 'setCancellationPolicy']);
    Route::put('admin/settings/recording', [AdminController::class, 'setRecording']);
    Route::get('admin/settings/audit-log', [AdminController::class, 'settingsAuditLog']);

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

    // Multi-Day Events (Scalable 1-on-1 Package-Based System)
    Route::get('multi-day-events', [MultiDayEventController::class, 'index']); // Public browse
    Route::get('multi-day-events/{id}', [MultiDayEventController::class, 'show']); // Public details
    Route::post('multi-day-events', [MultiDayEventController::class, 'store']); // Tutor create
    Route::put('multi-day-events/{id}', [MultiDayEventController::class, 'update']); // Tutor update
    Route::delete('multi-day-events/{id}', [MultiDayEventController::class, 'destroy']); // Tutor delete
    Route::get('trainer/multi-day-events', [MultiDayEventController::class, 'tutorEvents']); // Tutor's events
    
    // Multi-Day Bookings
    Route::post('multi-day-bookings', [MultiDayBookingController::class, 'store']); // Student book
    Route::get('user/multi-day-bookings', [MultiDayBookingController::class, 'userBookings']); // Student's bookings
    Route::get('trainer/multi-day-bookings', [MultiDayBookingController::class, 'tutorBookings']); // Tutor's bookings
    Route::get('multi-day-bookings/{id}', [MultiDayBookingController::class, 'show']); // Booking details
    Route::post('multi-day-bookings/{id}/cancel', [MultiDayBookingController::class, 'cancel']); // Student cancel
    
    // Multi-Day Sessions & Video
    Route::get('multi-day-sessions/{id}', [MultiDaySessionController::class, 'show']); // Session details
    Route::post('multi-day-sessions/{id}/join', [MultiDaySessionController::class, 'joinSession']); // Join video call
    Route::post('multi-day-sessions/{id}/leave', [MultiDaySessionController::class, 'leaveSession']); // Leave session
    Route::post('multi-day-sessions/{id}/complete', [MultiDaySessionController::class, 'completeSession']); // Mark complete
    Route::get('multi-day-bookings/{bookingId}/video/{dayNumber}', [MultiDaySessionController::class, 'videoSession']); // Video page
    Route::get('multi-day-events/{eventId}/sessions', [MultiDaySessionController::class, 'eventSessions']); // Tutor view all
});

// Public routes (if needed)
// Route::get('/health', function () {
//     return response()->json(['status' => 'ok']);
// });
