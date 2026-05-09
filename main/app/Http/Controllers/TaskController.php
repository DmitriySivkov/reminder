<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\SyncTasksRequest;

class TaskController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        $task = $request->validated();

        return Task::create($task)->id;
    }

    public function sync(SyncTasksRequest $request)
    {
        $tasks = $request->input('tasks');

        foreach ($tasks as $task) {
            Task::create($task);
        }
        // todo - ивент + channel. Возвращать на ивенте external_id таски
    }
}
