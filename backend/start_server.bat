@echo off
cd /d "%~dp0"
echo Starting Laravel server...
php artisan serve --host=127.0.0.1 --port=8000
pause
