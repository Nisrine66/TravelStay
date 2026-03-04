<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Testing mail configuration...\n";
    echo "Mail driver: " . config('mail.default') . "\n";
    echo "Mail host: " . config('mail.mailers.smtp.host') . "\n";
    echo "Mail port: " . config('mail.mailers.smtp.port') . "\n";
    echo "Mail username: " . config('mail.mailers.smtp.username') . "\n";
    
    // Test sending a simple email
    Mail::raw('This is a test email from MyHousing', function ($message) {
        $message->to('test@example.com')
                ->subject('Test Email');
    });
    
    echo "Test email sent successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
