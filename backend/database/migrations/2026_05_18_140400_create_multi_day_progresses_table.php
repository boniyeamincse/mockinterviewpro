<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multi_day_progresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('multi_day_bookings')->onDelete('cascade');
            $table->integer('day_number');
            $table->json('topics_covered')->nullable();
            $table->text('feedback_from_tutor')->nullable();
            $table->text('user_notes')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->integer('rating')->nullable(); // 1-5 star rating
            $table->json('ai_suggestions')->nullable(); // AI-generated feedback
            $table->timestamps();
            $table->index('booking_id');
            $table->unique(['booking_id', 'day_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multi_day_progresses');
    }
};
