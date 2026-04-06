<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $deviceId = $request->input('device_id');

        return Group::whereHas('users', function($query) use ($deviceId) {
            $query->where('device_id', $deviceId);
        });
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

    public function addUser(Request $request, Group $group)
    {
        $deviceId = $request->input('device_id');
        $addUserDeviceId = $request->input('add_user_device_id');

        if (
            !$group->users()
                ->where('device_id', $deviceId)
                ->exists()
        ) {
            throw new \LogicException('forbidden');
        }

        $addUser = User::where('device_id', $addUserDeviceId)->firstOrFail();

        $group->users()->attach($addUser->id);

        return $addUser;
    }
}
