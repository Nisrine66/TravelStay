# Profile API Setup Guide

## Files Created:
1. `app/Http/Controllers/ProfileController.php` - Main controller for profile operations
2. `app/Models/UserPreference.php` - Model for user preferences
3. `database/migrations/2024_03_11_000001_create_user_preferences_table.php` - Migration for preferences table
4. `database/seeders/UserPreferenceSeeder.php` - Seeder for default data
5. `routes/api.php` - Updated with profile routes

## Setup Instructions:

### 1. Run the Migration
```bash
cd backend
php artisan migrate
```

### 2. Run the Seeder (Optional - adds default data for existing users)
```bash
php artisan db:seed --class=UserPreferenceSeeder
```

### 3. Test the API Endpoints

#### Get Profile (GET /api/profile)
```bash
curl -X GET "http://127.0.0.1:8000/api/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Update Preferences (PUT /api/profile/preferences)
```bash
curl -X PUT "http://127.0.0.1:8000/api/profile/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "favorite_destinations": ["Thailand", "Japan", "Portugal"],
    "preferred_room_types": ["Entire apartment", "Entire house"],
    "budget_min": 50,
    "budget_max": 300,
    "amenities": ["wifi", "kitchen", "ac", "pool"]
  }'
```

#### Update Account (PUT /api/profile/account)
```bash
curl -X PUT "http://127.0.0.1:8000/api/profile/account" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

#### Change Password (PUT /api/profile/password)
```bash
curl -X PUT "http://127.0.0.1:8000/api/profile/password" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "oldpassword",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }'
```

## API Endpoints:

### Protected Routes (require auth:sanctum middleware):
- `GET /api/profile` - Get user profile with preferences
- `PUT /api/profile/preferences` - Update user preferences
- `PUT /api/profile/account` - Update account info (name, email)
- `PUT /api/profile/password` - Change password

## Response Format:

### Success Response:
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "favorite_destinations": ["Thailand", "Japan"],
    "preferred_room_types": ["Entire apartment"],
    "budget_min": 50,
    "budget_max": 300,
    "amenities": ["wifi", "kitchen"]
  }
}
```

### Error Response:
```json
{
  "message": "Validation failed",
  "errors": {
    "budget_max": ["The budget max must be greater than budget min."]
  }
}
```

## Features:

1. **Validation**: All inputs are properly validated
2. **Authorization**: All routes require valid Sanctum token
3. **Error Handling**: Comprehensive error messages
4. **Relationships**: User has one UserPreference
5. **Data Types**: JSON fields for arrays, integers for budget
6. **Unique Constraints**: One preference record per user

## Frontend Integration:

The frontend will automatically switch from demo mode to real data once the backend is running. No frontend changes needed!

## Testing:

1. Make sure your Laravel server is running: `php artisan serve`
2. Make sure you have a valid auth token
3. Test each endpoint with the curl commands above

The Profile API is now ready to use! 🚀
