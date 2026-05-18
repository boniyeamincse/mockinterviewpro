<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MultiDayEvent extends Model
{
    protected $fillable = [
        'tutor_id',
        'title',
        'description',
        'category',
        'total_days',
        'duration_minutes_per_day',
        'price_bdt',
        'difficulty_level',
        'topics',
        'prerequisites',
        'status',
        'package_type',
        'published_at',
    ];

    protected $casts = [
        'topics' => 'array',
        'prerequisites' => 'array',
        'published_at' => 'datetime',
    ];

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(MultiDaySession::class, 'event_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(MultiDayBooking::class, 'event_id');
    }

    public function scheduleData(): array
    {
        return [
            'total_days' => $this->total_days,
            'duration_per_day' => $this->duration_minutes_per_day,
            'sessions_count' => $this->sessions()->count(),
            'booked_count' => $this->bookings()->where('status', '!=', 'cancelled')->count(),
        ];
    }
}
