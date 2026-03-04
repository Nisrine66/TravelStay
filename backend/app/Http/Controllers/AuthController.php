<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Send email verification
        try {
            \Log::info('Attempting to send verification email to: ' . $user->email);
            $user->sendEmailVerificationNotification();
            \Log::info('Verification email sent successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        \Log::info('Login attempt for email: ' . $request->email);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        
        if (!Auth::attempt($request->only('email', 'password'))) {
            \Log::error('Login failed for email: ' . $request->email);
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        \Log::info('Login successful for user: ' . $user->id);

        // Temporarily disable email verification for testing
        // if (!$user->hasVerifiedEmail()) {
        //     return response()->json([
        //         'message' => 'Please verify your email first.'
        //     ], 403);
        // }

       
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        try {
            \Log::info('Attempting to send password reset email to: ' . $request->email);
            
            // Send a simple password reset email
            $user = User::where('email', $request->email)->first();
            
            // Create a simple reset token (in production, use Laravel's built-in system)
            $token = Str::random(60);
            
            // Send email using Laravel's Mail facade
            \Illuminate\Support\Facades\Mail::raw(
                "Hello {$user->name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n" .
                "http://localhost:5173/reset-password?token={$token}&email=" . urlencode($request->email) .
                "\n\nThis link will expire in 60 minutes.\n\nIf you didn't request this, please ignore this email.",
                function ($message) use ($request) {
                    $message->to($request->email)
                            ->subject('Password Reset Request - MyHousing')
                            ->from('noreply@myhousing.com', 'MyHousing');
                }
            );
            
            \Log::info('Password reset email sent successfully');
            
            return response()->json([
                'message' => 'Password reset instructions have been sent to your email'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
            return response()->json([
                'message' => 'Unable to send reset link: ' . $e->getMessage()
            ], 500);
        }
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        try {
            \Log::info('Attempting to reset password for email: ' . $request->email);

            // Find the user by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            // Update the user's password
            $user->password = Hash::make($request->password);
            $user->email_verified_at = now(); // Mark email as verified
            $user->save();

            \Log::info('Password reset successfully for user ID: ' . $user->id);

            return response()->json([
                'message' => 'Password has been reset successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to reset password: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to reset password: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}