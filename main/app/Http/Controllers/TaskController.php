<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;

class TaskController extends Controller
{
    public function store(StoreTaskRequest $request)
    {
        return Task::create($request->validated())->id;
    }
}
