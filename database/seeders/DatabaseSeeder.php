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

        for ($i = 0; $i < 100; $i++) {

            DB::table('users')->insert(
                [
                    'name' => $faker->name(),
                    'email' => $faker->email(),
                    'password' => Hash::make('azsqazsq'),
                    'actualMoney' => rand(0, 500000),
                    'role' => 0,
                    'buildings' => json_encode([
                        'Tipi' => rand(0, 5),
                        'Cabane' => rand(0, 5),
                        'Maison' => rand(0, 5),
                        'Villa' => rand(0, 5),
                        'Temple' => rand(0, 5),
                    ]),
                    'created_at' => Carbon::today()->subDays(rand(0, 30)),
                    'updated_at' => Carbon::now(),
                ]
            );
        }

        DB::table('users')->insert(
            [
                'name' => 'legrosdep',
                'email' => 'az@az.az',
                'password' => Hash::make('azsqazsq'),
                'actualMoney' => 1000000,
                'role' => 1,
                'buildings' => json_encode([
                    'Tipi' => 10,
                    'Cabane' => 10,
                    'Maison' => 10,
                    'Villa' => 10,
                    'Temple' => 10
                ]),
                'created_at' => Carbon::today()->subDays(rand(0, 30)),
            ]
        );
    }
}
