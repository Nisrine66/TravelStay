<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserPreference;

class UserPreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();
        
        foreach ($users as $user) {
            // Create preferences for each user if they don't exist
            if (!$user->preferences) {
                UserPreference::create([
                    'user_id' => $user->id,
                    'favorite_destinations' => ['Thailand', 'Japan', 'Portugal', 'Mexico', 'Spain', 'Italy'],
                    'preferred_room_types' => ['Entire apartment', 'Entire house'],
                    'budget_min' => 40,
                    'budget_max' => 250,
                    'amenities' => ['wifi', 'kitchen', 'ac', 'pool', 'gym', 'parking'],
                ]);
            }
        }
    }
}
