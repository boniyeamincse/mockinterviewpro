<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'user_type',
        'bio',
        'profile_image',
        'is_active',
        'email_verified_at',
        'last_login_at',
        'two_factor_enabled',
        'gender',
        'birthday',
        'academic_inst',
        'academic_degree',
        'academic_grad_year',
        'interests',
        'goals',
        'career_goal',
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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_enabled' => 'boolean',
        ];
    }

    /**
     * Get tasks for this user
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    /**
     * Check if user is trainer
     */
    public function isTrainer(): bool
    {
        return $this->user_type === 'trainer';
    }

    /**
     * Check if user is student
     */
    public function isStudent(): bool
    {
        return $this->user_type === 'student';
    }

    /**
     * Check if user email is verified
     */
    public function isEmailVerified(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Get user permissions based on type
     */
    public function getPermissions(): array
    {
        return match($this->user_type) {
            'admin' => [
                'manage_users',
                'manage_events',
                'manage_payments',
                'manage_content',
                'view_analytics',
                'manage_settings',
                'moderate_content',
                'manage_support',
            ],
            'trainer' => [
                'create_events',
                'view_bookings',
                'manage_sessions',
                'view_earnings',
                'upload_resources',
                'respond_reviews',
            ],
            'student' => [
                'search_events',
                'book_sessions',
                'view_bookings',
                'submit_reviews',
                'view_resources',
            ],
            default => [],
        };
    }

    /**
     * Check if user has permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->getPermissions());
    }

    /**
     * Check if user can perform action on resource
     */
    public function can($abilities, $arguments = []): bool
    {
        // Admin can do everything
        if ($this->isAdmin()) {
            return true;
        }

        // Trainer and student specific checks
        return match($action) {
            'edit_profile' => $resource === null || $resource->id === $this->id,
            'view_task' => $resource === null || $resource->user_id === $this->id,
            'edit_task' => $resource === null || $resource->user_id === $this->id,
            'delete_task' => $resource === null || $resource->user_id === $this->id,
            default => false,
        };
    }

    /**
     * Generate a new API token
     */
    public function generateApiToken(): string
    {
        return $this->createToken('api_token')->plainTextToken;
    }

    /**
     * Revoke all API tokens
     */
    public function revokeAllTokens(): void
    {
        $this->tokens()->delete();
    }

    /**
     * Get active API tokens
     */
    public function getActiveTokens(): array
    {
        return $this->tokens()
            ->select('id', 'name', 'created_at', 'last_used_at')
            ->get()
            ->toArray();
    }

    /**
     * Lock user account
     */
    public function lock(): void
    {
        $this->update(['is_active' => false]);
        $this->revokeAllTokens();
    }

    /**
     * Unlock user account
     */
    public function unlock(): void
    {
        $this->update(['is_active' => true]);
    }

    /**
     * Verify email address
     */
    public function verifyEmail(): void
    {
        $this->update(['email_verified_at' => now()]);
    }

    /**
     * Update last login timestamp
     */
    public function recordLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }

    /**
     * Get user full profile
     */
    public function getProfile(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'bio' => $this->bio,
            'profile_image' => $this->profile_image,
            'user_type' => $this->user_type,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'last_login_at' => $this->last_login_at,
            'two_factor_enabled' => $this->two_factor_enabled,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'academic_inst' => $this->academic_inst,
            'academic_degree' => $this->academic_degree,
            'academic_grad_year' => $this->academic_grad_year,
            'interests' => $this->interests,
            'goals' => $this->goals,
            'career_goal' => $this->career_goal,
            'skills' => $this->skills,
            'experience_level' => $this->experience_level,
            'resume_path' => $this->resume_path,
            'portfolio_links' => $this->portfolio_links,
            'github_profile' => $this->github_profile,
            'linkedin_profile' => $this->linkedin_profile,
            'certificates' => $this->certificates,
            'earned_badges' => $this->earned_badges,
            'points' => $this->points,
            'rank' => $this->rank,
            'permissions' => $this->getPermissions(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
