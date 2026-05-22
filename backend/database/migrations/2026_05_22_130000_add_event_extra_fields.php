<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'target_audience')) {
                $table->json('target_audience')->nullable()->after('sample_questions');
            }
            if (!Schema::hasColumn('events', 'meeting_type')) {
                $table->string('meeting_type', 50)->default('online')->after('target_audience');
            }
            if (!Schema::hasColumn('events', 'difficulty_level')) {
                $table->string('difficulty_level', 50)->default('beginner')->after('meeting_type');
            }
            if (!Schema::hasColumn('events', 'max_participants')) {
                $table->unsignedInteger('max_participants')->default(10)->after('difficulty_level');
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            foreach (['max_participants', 'difficulty_level', 'meeting_type', 'target_audience'] as $col) {
                if (Schema::hasColumn('events', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
