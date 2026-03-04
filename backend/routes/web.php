<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Password reset routes
Route::get('/reset-password/{token}', function ($token) {
    return response()->json(['message' => 'Password reset page', 'token' => $token]);
})->name('password.reset');
