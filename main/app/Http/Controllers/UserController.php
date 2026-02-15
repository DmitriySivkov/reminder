<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $deviceId = $request->input('device_id');
        $platform = $request->input('platform');
        $deviceModel = $request->input('device_model');

        return User::firstOrCreate(
            [
                'device_id' => $deviceId
            ],
            [
                'device_id'     => $deviceId,
                'platform'      => $platform,
                'device_model'  => $deviceModel
            ]);
    }

    public function search(Request $request)
    {
        $deviceId = $request->input('device_id');

        return User::where('device_id', $deviceId)->get();
    }
}
