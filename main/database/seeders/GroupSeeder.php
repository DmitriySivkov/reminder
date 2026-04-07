<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groupCount = 5;

        while ($groupCount > 0) {
            // todo - cut random user count and put it to limit
            $users = User::whereDoesntHave('groups')
                ->limit(fake()->numberBetween(5, 20))
                ->get();

            Group::factory()
                ->hasAttached($users)
                ->create();

            $groupCount --;
        }
    }
}
