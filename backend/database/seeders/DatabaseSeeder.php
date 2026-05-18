<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Candidate User
        User::updateOrCreate(
            ['email' => 'boniyeamin.cse1@gmail.com'],
            [
                'name' => 'Boni Yeamin',
                'password' => Hash::make('test@1234'),
                'user_type' => 'student',
                'phone' => '+8801700000000',
                'bio' => 'Passionate Software Engineering student focused on building scalable cloud systems.',
                'gender' => 'Male',
                'birthday' => '1999-12-31',
                'academic_inst' => 'BUET',
                'academic_degree' => 'B.Sc. in CSE',
                'academic_grad_year' => 2026,
                'interests' => 'React, Go, System Design',
                'goals' => 'Aiming for Staff Engineer at Google.',
                'career_goal' => 'Full Stack Engineer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Trainer User
        User::updateOrCreate(
            ['email' => 'trainer@interviewpro.com'],
            [
                'name' => 'Michael Chang',
                'password' => Hash::make('test@1234'),
                'user_type' => 'trainer',
                'phone' => '+15550199',
                'bio' => 'Ex-Google Staff Software Engineer with 10+ years conducting FAANG mock loops.',
                'gender' => 'Male',
                'birthday' => '1985-06-15',
                'academic_inst' => 'Stanford University',
                'academic_degree' => 'M.S. in Computer Science',
                'academic_grad_year' => 2008,
                'interests' => 'Systems Architecture, Distributed Systems, Go',
                'goals' => 'Guiding candidates to ace FAANG loops.',
                'career_goal' => 'Staff Engineer Trainer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Admin User
        User::updateOrCreate(
            ['email' => 'admin@interviewpro.com'],
            [
                'name' => 'Admin Controller',
                'password' => Hash::make('test@1234'),
                'user_type' => 'admin',
                'phone' => '+8801800000000',
                'bio' => 'Central moderation and platform operations director.',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
