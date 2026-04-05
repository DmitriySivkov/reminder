<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    const PLATFORM_ANDROID = 'android';
    const PLATFORM_IOS = 'ios';

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $platform = fake()->randomElement([self::PLATFORM_ANDROID, self::PLATFORM_IOS]);

        $deviceModel = 'test unknown device';

        if ($platform === self::PLATFORM_ANDROID) {
            $deviceModel = 'test_' . self::PLATFORM_ANDROID . '_device';
        }

        if ($platform === self::PLATFORM_IOS) {
            $deviceModel = 'test_' . self::PLATFORM_IOS . '_device';
        }

        return [
            'name'          => fake()->randomElement([null, fake()->name]),
            'device_id'     => \Str::uuid(),
            'platform'      => $platform,
            'device_model'  => $deviceModel
        ];
    }
}
