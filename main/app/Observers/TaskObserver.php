<?php

namespace App\Observers;

use App\Models\Task;
use App\Events\TaskCreatedEvent;

class TaskObserver
{
    public function created(Task $task)
    {
        TaskCreatedEvent::dispatch($task);
    }
}
