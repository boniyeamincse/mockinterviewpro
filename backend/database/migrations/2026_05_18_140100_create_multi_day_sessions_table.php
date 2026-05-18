<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multi_day_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('multi_day_events')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('multi_day_bookings')->onDelete('cascade');
            $table->integer('day_number');
            $table->dateTime('scheduled_at');
            $table->dateTime('ends_at');
            $table->string('status')->default('scheduled'); // scheduled, ongoing, completed, cancelled
            $table->string('video_token')->nullable();
            $table->string('recording_url')->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
            $table->index('event_id');
            $table->index('booking_id');
            $table->index('scheduled_at');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multi_day_sessions');
    }
};
