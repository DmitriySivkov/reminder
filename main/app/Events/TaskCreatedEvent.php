<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskCreatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $queue;

    private Task $task;

    /**
     * Create a new event instance.
     */
    public function __construct(Task $task)
    {
        $this->queue = config('queue.broadcast');

        $this->task = $task;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("users.{$this->task->user->device_id}.groups.{$this->task->group->uuid}"),
            new PrivateChannel("users.{$this->task->owner->device_id}.groups.{$this->task->group->uuid}")
        ];
    }

    public function broadcastAs()
    {
        return "task.created";
    }

    public function broadcastWith()
    {
        return [
            'model' => $this->task
        ];
    }
}
