<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multi_day_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('multi_day_events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->integer('total_days');
            $table->integer('completed_days')->default(0);
            $table->integer('total_price_bdt');
            $table->string('status')->default('confirmed'); // confirmed, in_progress, completed, cancelled
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->index('event_id');
            $table->index('user_id');
            $table->index('tutor_id');
            $table->index('status');
            $table->unique(['event_id', 'user_id']); // One user per event
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multi_day_bookings');
    }
};
