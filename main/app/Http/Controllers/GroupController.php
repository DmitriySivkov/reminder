<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        return Group::filter($request->all())
            ->get();
    }

    public function store(Request $request)
    {
        $name = $request->input('name');
        $deviceId = $request->input('device_id');

        $group = Group::create([
            'uuid' => \Str::uuid(),
            'name' => $name
        ]);

        $addUser = User::where('device_id', $deviceId)->firstOrFail();

        $group->users()->attach($addUser->id);

        return $group;
    }

    public function update(Request $request, Group $group)
    {
        $name = $request->input('name');

        $group->update([
            'name' => $name
        ]);
    }

    public function join(Request $request, string $groupUuid, string $deviceId)
    {
        $user = User::where('device_id', $deviceId)->firstOrFail();

        if (!$group = Group::where('uuid', $groupUuid)->first()) {
            throw new \LogicException('Группа не существует');
        }

        if ($group->users()->where('id', $user->id)->exists()) {
            throw new \LogicException('Вы являетесь участником этой группы');
        }

        $group->users()->attach($user->id);

        return $group->load(['users']);
    }
}
