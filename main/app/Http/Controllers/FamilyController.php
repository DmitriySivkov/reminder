<?php

namespace App\Http\Controllers;

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

        return Family::create([
            'name' => $name
        ]);
    }

    public function update(Request $request, Family $family)
    {
        $name = $request->input('name');

        $family->update([
            'name' => $name
        ]);
    }
}
