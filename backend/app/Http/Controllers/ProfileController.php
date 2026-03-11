<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserPreference;

class ProfileController extends Controller
{
    /**
     * Get user profile with preferences
     */
    public function show(): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get or create user preferences
            $preferences = $user->preferences ?? new UserPreference();
            
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                ],
                'preferences' => [
                    'favorite_destinations' => $preferences->favorite_destinations ?? [],
                    'preferred_room_types' => $preferences->preferred_room_types ?? [],
                    'budget_min' => $preferences->budget_min ?? 40,
                    'budget_max' => $preferences->budget_max ?? 250,
                    'amenities' => $preferences->amenities ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'favorite_destinations' => 'array',
                'favorite_destinations.*' => 'string|max:255',
                'preferred_room_types' => 'array',
                'preferred_room_types.*' => 'string|max:255',
                'budget_min' => 'integer|min:0|max:1000',
                'budget_max' => 'integer|min:0|max:1000|gt:budget_min',
                'amenities' => 'array',
                'amenities.*' => 'string|max:100',
            ]);
            
            $user = Auth::user();
            
            // Update or create user preferences
            $preferences = $user->preferences ?? new UserPreference();
            $preferences->user_id = $user->id;
            $preferences->favorite_destinations = $request->favorite_destinations ?? [];
            $preferences->preferred_room_types = $request->preferred_room_types ?? [];
            $preferences->budget_min = $request->budget_min;
            $preferences->budget_max = $request->budget_max;
            $preferences->amenities = $request->amenities ?? [];
            $preferences->save();
            
            return response()->json([
                'message' => 'Preferences updated successfully',
                'preferences' => [
                    'favorite_destinations' => $preferences->favorite_destinations,
                    'preferred_room_types' => $preferences->preferred_room_types,
                    'budget_min' => $preferences->budget_min,
                    'budget_max' => $preferences->budget_max,
                    'amenities' => $preferences->amenities,
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update user account information
     */
    public function updateAccount(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
            ]);
            
            $user = Auth::user();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();
            
            return response()->json([
                'message' => 'Account updated successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Change user password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);
            
            $user = Auth::user();
            
            // Verify current password
            if (!\Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 422);
            }
            
            // Update password
            $user->password = \Hash::make($request->password);
            $user->save();
            
            return response()->json([
                'message' => 'Password changed successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
