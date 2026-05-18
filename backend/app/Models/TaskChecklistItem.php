<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskChecklistItem extends Model
{
    protected $table = 'task_checklist_items';

    protected $fillable = [
        'task_id',
        'title',
        'completed',
        'order',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the task this checklist item belongs to
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Toggle completion status
     */
    public function toggleCompletion(): void
    {
        $this->update(['completed' => !$this->completed]);
    }

    /**
     * Mark as completed
     */
    public function markAsCompleted(): void
    {
        $this->update(['completed' => true]);
    }

    /**
     * Mark as incomplete
     */
    public function markAsIncomplete(): void
    {
        $this->update(['completed' => false]);
    }
}
