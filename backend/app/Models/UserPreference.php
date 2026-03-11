<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'favorite_destinations',
        'preferred_room_types',
        'budget_min',
        'budget_max',
        'amenities',
    ];

    protected $casts = [
        'favorite_destinations' => 'array',
        'preferred_room_types' => 'array',
        'amenities' => 'array',
        'budget_min' => 'integer',
        'budget_max' => 'integer',
    ];

    /**
     * Get the user that owns the preferences.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
