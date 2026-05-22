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
        Schema::table('users', function (Blueprint $table) {
            $table->text('skills')->nullable()->after('career_goal');
            $table->string('experience_level')->nullable()->after('skills');
            $table->string('resume_path')->nullable()->after('experience_level');
            $table->text('portfolio_links')->nullable()->after('resume_path');
            $table->string('github_profile')->nullable()->after('portfolio_links');
            $table->string('linkedin_profile')->nullable()->after('github_profile');
            $table->text('certificates')->nullable()->after('linkedin_profile');
            $table->text('earned_badges')->nullable()->after('certificates');
            $table->integer('points')->default(0)->after('earned_badges');
            $table->string('rank')->nullable()->default('Novice')->after('points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'skills',
                'experience_level',
                'resume_path',
                'portfolio_links',
                'github_profile',
                'linkedin_profile',
                'certificates',
                'earned_badges',
                'points',
                'rank',
            ]);
        });
    }
};
