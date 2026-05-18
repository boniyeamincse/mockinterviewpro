<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MultiDayProgress extends Model
{
    protected $fillable = [
        'booking_id',
        'day_number',
        'topics_covered',
        'feedback_from_tutor',
        'user_notes',
        'completed_at',
        'rating',
        'ai_suggestions',
    ];

    protected $casts = [
        'topics_covered' => 'array',
        'ai_suggestions' => 'array',
        'completed_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(MultiDayBooking::class, 'booking_id');
    }
}
