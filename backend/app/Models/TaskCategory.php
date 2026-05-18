<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskCategory extends Model
{
    use SoftDeletes;

    protected $table = 'task_categories';

    protected $fillable = [
        'name',
        'description',
        'color',
        'icon',
        'order',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the tasks in this category
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'category_id');
    }

    /**
     * Get count of tasks in this category
     */
    public function getTaskCountAttribute(): int
    {
        return $this->tasks()->count();
    }

    /**
     * Get count of pending tasks in this category
     */
    public function getPendingTasksCountAttribute(): int
    {
        return $this->tasks()->byStatus('pending')->count();
    }

    /**
     * Get count of completed tasks in this category
     */
    public function getCompletedTasksCountAttribute(): int
    {
        return $this->tasks()->byStatus('completed')->count();
    }
}
