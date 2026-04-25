<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $group_id
 * @property int $user_id
 * @property int $owner_id
 * @property string $headline
 * @property string $text
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereGroupId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereHeadline($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUserId($value)
 * @mixin \Eloquent
 */
class Task extends Model
{
    protected $guarded = [];

    public function user()
    {
        $this->belongsTo(User::class);
    }

    public function group()
    {
        $this->belongsTo(Group::class);
    }

    public function owner()
    {
        $this->belongsTo(User::class, 'owner_id');
    }
}
