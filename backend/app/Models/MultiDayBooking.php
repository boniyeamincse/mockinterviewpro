<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MultiDayBooking extends Model
{
    protected $fillable = [
        'event_id',
        'user_id',
        'tutor_id',
        'total_days',
        'completed_days',
        'total_price_bdt',
        'status',
        'started_at',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(MultiDayEvent::class, 'event_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(MultiDaySession::class, 'booking_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(MultiDayProgress::class, 'booking_id');
    }

    public function getProgressPercentage(): float
    {
        if ($this->total_days === 0) {
            return 0;
        }
        return round(($this->completed_days / $this->total_days) * 100, 2);
    }

    public function getNextSession(): ?MultiDaySession
    {
        return $this->sessions()
            ->where('status', '!=', 'cancelled')
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at', 'asc')
            ->first();
    }

    public function markSessionCompleted(int $dayNumber): bool
    {
        if ($this->completed_days >= $this->total_days) {
            return false;
        }

        $this->completed_days++;
        if ($this->completed_days === $this->total_days) {
            $this->status = 'completed';
            $this->completed_at = now();
        } else {
            $this->status = 'in_progress';
        }

        return $this->save();
    }

    public function cancel(string $reason): bool
    {
        $this->status = 'cancelled';
        $this->cancelled_at = now();
        $this->cancellation_reason = $reason;

        // Cancel all future sessions
        $this->sessions()
            ->where('scheduled_at', '>', now())
            ->update(['status' => 'cancelled']);

        return $this->save();
    }
}
