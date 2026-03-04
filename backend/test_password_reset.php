<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;

try {
    echo "Testing password reset...\n";
    
    // Test with an existing email
    $email = 'nisrineelkouri07@gmail.com'; // Change this to an existing email
    
    echo "Attempting to send reset link to: $email\n";
    
    $status = Password::sendResetLink(['email' => $email]);
    
    echo "Password reset status: $status\n";
    echo "Password::RESET_LINK_SENT constant: " . Password::RESET_LINK_SENT . "\n";
    
    if ($status === Password::RESET_LINK_SENT) {
        echo "SUCCESS: Reset link sent!\n";
    } else {
        echo "FAILED: Reset link not sent\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}
