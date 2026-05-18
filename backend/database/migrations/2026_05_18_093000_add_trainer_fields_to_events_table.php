<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'category')) {
                $table->enum('category', [
                    'software_engineering',
                    'data_science',
                    'product_design',
                    'product_management',
                    'finance',
                    'consulting',
                    'marketing',
                    'devops',
                    'healthcare',
                    'law',
                    'academia',
                    'general',
                ])->default('general')->after('title');
            }

            if (!Schema::hasColumn('events', 'interview_type')) {
                $table->enum('interview_type', ['technical', 'behavioral', 'case_study', 'hr', 'mixed'])
                    ->default('technical')
                    ->after('category');
            }

            if (!Schema::hasColumn('events', 'topics_covered')) {
                $table->json('topics_covered')->nullable()->after('description');
            }

            if (!Schema::hasColumn('events', 'process_overview')) {
                $table->text('process_overview')->nullable()->after('topics_covered');
            }

            if (!Schema::hasColumn('events', 'language')) {
                $table->string('language', 100)->default('Bangla + English')->after('process_overview');
            }

            if (!Schema::hasColumn('events', 'sample_questions')) {
                $table->json('sample_questions')->nullable()->after('language');
            }

            if (!Schema::hasColumn('events', 'total_sessions')) {
                $table->unsignedInteger('total_sessions')->default(1)->after('sample_questions');
            }

            if (!Schema::hasColumn('events', 'duration_minutes')) {
                $table->unsignedSmallInteger('duration_minutes')->default(60)->after('total_sessions');
            }

            if (!Schema::hasColumn('events', 'price_bdt')) {
                $table->unsignedInteger('price_bdt')->default(200)->after('duration_minutes');
            }

            if (!Schema::hasColumn('events', 'cancellation_policy')) {
                $table->text('cancellation_policy')->nullable()->after('price_bdt');
            }

            if (!Schema::hasColumn('events', 'reschedule_policy')) {
                $table->text('reschedule_policy')->nullable()->after('cancellation_policy');
            }

            if (!Schema::hasColumn('events', 'available_slots')) {
                $table->json('available_slots')->nullable()->after('reschedule_policy');
            }

            if (!Schema::hasColumn('events', 'blocked_dates')) {
                $table->json('blocked_dates')->nullable()->after('available_slots');
            }

            if (!Schema::hasColumn('events', 'timezone')) {
                $table->string('timezone', 100)->default('UTC')->after('blocked_dates');
            }

            if (!Schema::hasColumn('events', 'slot_buffer_minutes')) {
                $table->unsignedSmallInteger('slot_buffer_minutes')->default(15)->after('timezone');
            }

            if (!Schema::hasColumn('events', 'advance_notice_hours')) {
                $table->unsignedSmallInteger('advance_notice_hours')->default(24)->after('slot_buffer_minutes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $columns = [
                'advance_notice_hours',
                'slot_buffer_minutes',
                'timezone',
                'blocked_dates',
                'available_slots',
                'reschedule_policy',
                'cancellation_policy',
                'price_bdt',
                'duration_minutes',
                'total_sessions',
                'sample_questions',
                'language',
                'process_overview',
                'topics_covered',
                'interview_type',
                'category',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('events', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
