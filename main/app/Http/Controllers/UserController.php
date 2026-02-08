<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // todo - install ide-helper
        $deviceId = $request->input('device_id');
        $platform = $request->input('platform');
        $deviceModel = $request->input('device_model');

        // todo check unique by device_id
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
}
