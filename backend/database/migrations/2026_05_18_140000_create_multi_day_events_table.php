<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multi_day_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->integer('total_days');
            $table->integer('duration_minutes_per_day');
            $table->integer('price_bdt');
            $table->string('difficulty_level')->default('intermediate'); // beginner, intermediate, advanced
            $table->json('topics')->nullable();
            $table->json('prerequisites')->nullable();
            $table->string('status')->default('scheduled'); // scheduled, active, completed, cancelled
            $table->string('package_type')->default('custom'); // 3days, 5days, 7days, 9days, custom
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index('tutor_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multi_day_events');
    }
};
