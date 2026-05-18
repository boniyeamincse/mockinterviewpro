<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'category',
        'interview_type',
        'description',
        'topics_covered',
        'process_overview',
        'language',
        'sample_questions',
        'total_sessions',
        'duration_minutes',
        'price_bdt',
        'cancellation_policy',
        'reschedule_policy',
        'available_slots',
        'blocked_dates',
        'timezone',
        'slot_buffer_minutes',
        'advance_notice_hours',
        'status',
        'starts_at',
        'ends_at',
        'published_at',
        'archived_at',
    ];

    protected $casts = [
        'topics_covered' => 'array',
        'sample_questions' => 'array',
        'available_slots' => 'array',
        'blocked_dates' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'published_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function slots(): HasMany
    {
        return $this->hasMany(EventSlot::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeForTrainer($query, int $trainerId)
    {
        return $query->where('user_id', $trainerId);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

