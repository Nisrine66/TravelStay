<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\AIController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return response()->json([
        'message' => 'Email verified successfully'
    ]);
})->middleware(['signed'])->name('verification.verify');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

<<<<<<< HEAD
Route::post('/predict-price', [AIController::class, 'predictPrice']);
Route::post('/recommend', [AIController::class, 'recommend']);
Route::post('/destination', [AIController::class, 'destination']);
=======
// Profile routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences']);
    Route::put('/profile/account', [ProfileController::class, 'updateAccount']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
});
>>>>>>> 26045af97cd59d2029eb9f9325ae05886d7392b8
