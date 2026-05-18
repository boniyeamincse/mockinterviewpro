<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('auth.forgot-password');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
    Route::post('verify-email', [AuthController::class, 'verifyEmail'])->name('auth.verify-email');
    Route::post('resend-verification', [AuthController::class, 'resendVerificationEmail'])->name('auth.resend-verification');
});

// Protected authentication routes
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('me', [AuthController::class, 'getCurrentUser'])->name('auth.me');
    Route::put('profile', [AuthController::class, 'updateProfile'])->name('auth.update-profile');
    Route::post('change-password', [AuthController::class, 'changePassword'])->name('auth.change-password');
    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('refresh-token', [AuthController::class, 'refreshToken'])->name('auth.refresh-token');
});
