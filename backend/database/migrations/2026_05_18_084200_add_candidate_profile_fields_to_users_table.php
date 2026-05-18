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
            $table->string('gender')->nullable()->after('bio');
            $table->date('birthday')->nullable()->after('gender');
            $table->string('academic_inst')->nullable()->after('birthday');
            $table->string('academic_degree')->nullable()->after('academic_inst');
            $table->integer('academic_grad_year')->nullable()->after('academic_degree');
            $table->text('interests')->nullable()->after('academic_grad_year');
            $table->text('goals')->nullable()->after('interests');
            $table->string('career_goal')->nullable()->after('goals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'birthday',
                'academic_inst',
                'academic_degree',
                'academic_grad_year',
                'interests',
                'goals',
                'career_goal',
            ]);
        });
    }
};
