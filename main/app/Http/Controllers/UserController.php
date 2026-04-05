<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $userName = $request->input('user_name');
        $deviceId = $request->input('device_id');
        $platform = $request->input('platform');
        $deviceModel = $request->input('device_model');

        return User::firstOrCreate(
            [
                'device_id' => $deviceId
            ],
            [
                'name'          => $userName,
                'device_id'     => $deviceId,
                'platform'      => $platform,
                'device_model'  => $deviceModel
            ]);
    }

    public function search(Request $request)
    {
        $deviceId = $request->input('device_id');

        return User::whereLike(['device_id'], $deviceId)->get();
    }
}
