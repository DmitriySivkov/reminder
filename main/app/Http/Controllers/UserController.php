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

        return User::create([
            'device_id' => $deviceId,
            'platform' => $platform
        ]);
    }
}
