<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'expertise')) {
                $table->json('expertise')->nullable()->after('bio');
            }
            if (!Schema::hasColumn('users', 'experience_years')) {
                $table->unsignedSmallInteger('experience_years')->nullable()->after('expertise');
            }
            if (!Schema::hasColumn('users', 'linkedin_url')) {
                $table->string('linkedin_url')->nullable()->after('experience_years');
            }
            if (!Schema::hasColumn('users', 'website_url')) {
                $table->string('website_url')->nullable()->after('linkedin_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $drop = [];
            foreach (['expertise', 'experience_years', 'linkedin_url', 'website_url'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $drop[] = $column;
                }
            }
            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });
    }
};
