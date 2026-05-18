<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTag extends Model
{
    protected $table = 'task_tags';

    protected $fillable = [
        'task_id',
        'tag',
    ];

    public $timestamps = false;

    /**
     * Get the task this tag belongs to
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
