<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MultiDaySession extends Model
{
    protected $fillable = [
        'event_id',
        'booking_id',
        'day_number',
        'scheduled_at',
        'ends_at',
        'status',
        'video_token',
        'recording_url',
        'notes',
        'completed_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(MultiDayEvent::class, 'event_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(MultiDayBooking::class, 'booking_id');
    }

    public function attendance(): HasOne
    {
        return $this->hasOne(SessionAttendance::class, 'session_id');
    }

    public function isUpcoming(): bool
    {
        return $this->scheduled_at > now() && $this->status !== 'cancelled';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canJoin(): bool
    {
        $now = now();
        $scheduledTime = $this->scheduled_at;
        $endTime = $this->ends_at;

        // Allow join 5 minutes before scheduled time until end time
        return $now >= $scheduledTime->copy()->subMinutes(5) && $now <= $endTime && $this->status !== 'cancelled';
    }
}
