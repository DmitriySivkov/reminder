<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('users.{deviceId}.groups.{groupUuid}', function (?\App\Models\User $user, string $deviceId, string $groupUuid) {
    $user = \App\Models\User::where('device_id', $deviceId)->first();

    return $user->groups()->where('uuid', $groupUuid)->exists();
});
