<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionAttendance extends Model
{
    protected $fillable = [
        'session_id',
        'booking_id',
        'user_id',
        'attended',
        'joined_at',
        'left_at',
        'duration_minutes',
    ];

    protected $casts = [
        'attended' => 'boolean',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(MultiDaySession::class, 'session_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(MultiDayBooking::class, 'booking_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
