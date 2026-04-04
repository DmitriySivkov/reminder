<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Family;
use Illuminate\Http\Request;

class FamilyController extends Controller
{
    public function index(Request $request)
    {
        $deviceId = $request->input('device_id');

        return Family::whereHas('users', function($query) use ($deviceId) {
            $query->where('device_id', $deviceId);
        });
    }

    public function store(Request $request)
    {
        $name = $request->input('name');
        $deviceId = $request->input('device_id');

        $family = Family::create([
            'name' => $name
        ]);

        $addUser = User::where('device_id', $deviceId)->firstOrFail();

        $family->users()->attach($addUser->id);

        return $family;
    }

    public function update(Request $request, Family $family)
    {
        $name = $request->input('name');

        $family->update([
            'name' => $name
        ]);
    }

    public function addUser(Request $request, Family $family)
    {
        $deviceId = $request->input('device_id');
        $addUserDeviceId = $request->input('add_user_device_id');

        if (
            !$family->users()
                ->where('device_id', $deviceId)
                ->exists()
        ) {
            throw new \LogicException('forbidden');
        }

        $addUser = User::where('device_id', $addUserDeviceId)->firstOrFail();

        $family->users()->attach($addUser->id);

        return $addUser;
    }
}
