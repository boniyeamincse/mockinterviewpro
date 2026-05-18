<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category_id',
        'priority',
        'due_date',
        'session_id',
        'estimated_hours',
        'actual_hours',
        'status',
        'progress_percentage',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'estimated_hours' => 'float',
        'actual_hours' => 'float',
        'progress_percentage' => 'integer',
    ];

    /**
     * Get the user that owns the task
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category for the task
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(TaskCategory::class, 'category_id');
    }

    /**
     * Get the session associated with the task
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    /**
     * Get the checklist items for this task
     */
    public function checklistItems(): HasMany
    {
        return $this->hasMany(TaskChecklistItem::class)->orderBy('order');
    }

    /**
     * Get the attachments for this task
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    /**
     * Get task tags
     */
    public function tags(): HasMany
    {
        return $this->hasMany(TaskTag::class);
    }

    /**
     * Scope to filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by priority
     */
    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to filter by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope to filter by session
     */
    public function scopeBySession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Scope for overdue tasks
     */
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('status', '!=', 'completed');
    }

    /**
     * Scope for tasks due today
     */
    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today())
            ->where('status', '!=', 'completed');
    }

    /**
     * Scope for tasks due this week
     */
    public function scopeDueThisWeek($query)
    {
        return $query->whereBetween('due_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ])->where('status', '!=', 'completed');
    }

    /**
     * Mark task as completed
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'progress_percentage' => 100,
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark task as in progress
     */
    public function markAsInProgress(): void
    {
        $this->update([
            'status' => 'in_progress',
            'completed_at' => null,
        ]);
    }

    /**
     * Update task progress
     */
    public function updateProgress(int $percentage, ?float $hours = null): void
    {
        $data = ['progress_percentage' => $percentage];

        if ($hours !== null) {
            $data['actual_hours'] = $hours;
        }

        if ($percentage == 100) {
            $data['status'] = 'completed';
            $data['completed_at'] = now();
        }

        $this->update($data);
    }

    /**
     * Get percentage of completion for checklist
     */
    public function getChecklistCompletionPercentage(): float
    {
        $items = $this->checklistItems;

        if ($items->isEmpty()) {
            return 0;
        }

        $completed = $items->filter(fn($item) => $item->completed)->count();
        return round(($completed / $items->count()) * 100);
    }

    /**
     * Check if task is overdue
     */
    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'completed';
    }

    /**
     * Get priority color
     */
    public function getPriorityColor(): string
    {
        return match($this->priority) {
            'high' => '#FF5733',
            'medium' => '#FFC300',
            'low' => '#28A745',
            default => '#6C757D',
        };
    }

    /**
     * Get status badge
     */
    public function getStatusBadge(): string
    {
        return match($this->status) {
            'pending' => 'secondary',
            'in_progress' => 'primary',
            'completed' => 'success',
            default => 'dark',
        };
    }
}
