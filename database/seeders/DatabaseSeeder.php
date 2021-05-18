<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();

        for ($i = 0; $i < 40; $i++) {

            DB::table('users')->insert(
                [
                    'name' => $faker->name(),
                    'email' => $faker->email(),
                    'password' => Hash::make('azsqazsq'),
                    'actualMoney' => rand(0, 500000),
                    'role' => 0,
                    'buildings' => json_encode([
                        'Tepee' => rand(0, 5),
                        'Hut' => rand(0, 5),
                        'House' => rand(0, 5),
                        'Villa' => rand(0, 5),
                        'Temple' => rand(0, 5),
                    ]),
                    'created_at' => Carbon::today()->subDays(rand(0, 5)),
                    'updated_at' => Carbon::now(),
                ]
            );
        }

        DB::table('users')->insert(
            [
                'name' => 'Demo',
                'email' => 'az@az.az',
                'password' => Hash::make('azsqazsq'),
                'actualMoney' => 1000000,
                'role' => 1,
                'buildings' => json_encode([
                    'Tepee' => 10,
                    'Hut' => 10,
                    'House' => 10,
                    'Villa' => 10,
                    'Temple' => 10
                ]),
                'created_at' => Carbon::today()->subDays(rand(0, 5)),
            ]
        );
    }
}
