<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('event_slots')) {
            Schema::create('event_slots', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
                $table->timestamp('starts_at');
                $table->timestamp('ends_at')->nullable();
                $table->enum('status', ['open', 'booked', 'blocked'])->default('open');
                $table->unsignedBigInteger('booking_id')->nullable();
                $table->timestamps();
                $table->index(['event_id', 'status']);
                $table->index('starts_at');
            });
        }

        if (!Schema::hasTable('availability_blocks')) {
            Schema::create('availability_blocks', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->date('blocked_date');
                $table->string('reason')->nullable();
                $table->timestamps();
                $table->unique(['user_id', 'blocked_date']);
            });
        }

        if (!Schema::hasTable('bookings')) {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
                $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('student_id')->nullable()->constrained('users')->nullOnDelete();
                $table->unsignedBigInteger('slot_id')->nullable();
                $table->enum('status', ['upcoming', 'cancelled', 'completed'])->default('upcoming');
                $table->timestamp('scheduled_at')->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->text('cancel_reason')->nullable();
                $table->timestamps();
                $table->index(['trainer_id', 'status']);
                $table->index('scheduled_at');
            });
        }

        if (!Schema::hasTable('session_rooms')) {
            Schema::create('session_rooms', function (Blueprint $table) {
                $table->id();
                $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
                $table->string('room_token')->nullable();
                $table->enum('status', ['waiting', 'live', 'ended'])->default('waiting');
                $table->string('recording_url')->nullable();
                $table->timestamp('ended_at')->nullable();
                $table->timestamps();
                $table->unique('booking_id');
            });
        }

        if (!Schema::hasTable('wallet_transactions')) {
            Schema::create('wallet_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->enum('type', ['credit', 'debit']);
                $table->string('source')->nullable();
                $table->integer('amount_bdt');
                $table->enum('status', ['pending', 'settled', 'failed'])->default('settled');
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'type']);
            });
        }

        if (!Schema::hasTable('withdrawal_requests')) {
            Schema::create('withdrawal_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->integer('amount_bdt');
                $table->enum('status', ['pending', 'approved', 'rejected', 'paid'])->default('pending');
                $table->json('account_snapshot')->nullable();
                $table->timestamp('requested_at')->nullable();
                $table->timestamp('processed_at')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'status']);
            });
        }

        if (!Schema::hasTable('trainer_bank_accounts')) {
            Schema::create('trainer_bank_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('account_type')->default('bank');
                $table->string('account_name')->nullable();
                $table->string('account_number')->nullable();
                $table->string('bank_name')->nullable();
                $table->string('routing_number')->nullable();
                $table->string('mobile_wallet')->nullable();
                $table->timestamps();
                $table->unique('user_id');
            });
        }

        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
                $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
                $table->foreignId('trainer_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('student_id')->nullable()->constrained('users')->nullOnDelete();
                $table->unsignedTinyInteger('rating')->default(5);
                $table->text('comment')->nullable();
                $table->text('trainer_reply')->nullable();
                $table->timestamp('trainer_replied_at')->nullable();
                $table->timestamps();
                $table->index(['trainer_id', 'created_at']);
            });
        }

        if (!Schema::hasTable('trainer_notifications')) {
            Schema::create('trainer_notifications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('title');
                $table->text('message');
                $table->string('type')->default('info');
                $table->boolean('is_read')->default(false);
                $table->timestamp('read_at')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'is_read']);
            });
        }

        if (!Schema::hasTable('trainer_notification_preferences')) {
            Schema::create('trainer_notification_preferences', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->boolean('email_enabled')->default(true);
                $table->boolean('sms_enabled')->default(false);
                $table->boolean('push_enabled')->default(true);
                $table->timestamps();
                $table->unique('user_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_notification_preferences');
        Schema::dropIfExists('trainer_notifications');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('trainer_bank_accounts');
        Schema::dropIfExists('withdrawal_requests');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('session_rooms');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('availability_blocks');
        Schema::dropIfExists('event_slots');
    }
};
