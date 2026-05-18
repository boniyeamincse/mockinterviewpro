<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('multi_day_sessions')->onDelete('cascade');
            $table->foreignId('booking_id')->constrained('multi_day_bookings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('attended')->default(false);
            $table->dateTime('joined_at')->nullable();
            $table->dateTime('left_at')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->timestamps();
            $table->unique(['session_id', 'user_id']);
            $table->index('booking_id');
            $table->index('attended');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_attendances');
    }
};
