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
            // Add authentication fields
            $table->enum('user_type', ['student', 'trainer', 'admin'])->default('student')->after('email');
            $table->string('phone')->nullable()->after('user_type');
            $table->text('bio')->nullable()->after('phone');
            $table->string('profile_image')->nullable()->after('bio');
            $table->boolean('is_active')->default(true)->after('profile_image');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->boolean('two_factor_enabled')->default(false)->after('last_login_at');

            // Add indexes
            $table->index('user_type');
            $table->index('is_active');
            $table->index('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_type',
                'phone',
                'bio',
                'profile_image',
                'is_active',
                'last_login_at',
                'two_factor_enabled',
            ]);

            $table->dropIndex(['user_type']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['email_verified_at']);
        });
    }
};
