@echo off
title FoodHub MERN Stack - Starter
color 0A

echo ========================================================
echo        FOODHUB - FOOD ORDERING MANAGEMENT SYSTEM
echo ========================================================
echo.

cd /d "%~dp0"

:: Prevent Node heap allocation crashes
set "NODE_OPTIONS=--max-old-space-size=4096"

:: 1. Ensure MongoDB is Running
echo [*] Checking MongoDB Database Engine on port 27017...
netstat -aon | findstr ":27017" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is already active.
) else (
    echo [!] Starting local MongoDB Engine...
    if not exist "%~dp0server\data" mkdir "%~dp0server\data"
    if exist "D:\MongoDB\Server\8.3\bin\mongod.exe" (
        start "FoodHub Database (MongoDB)" /min "D:\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "%~dp0server\data" --port 27017
    ) else (
        net start MongoDB >nul 2>&1
    )
    ping -n 4 127.0.0.1 >nul
)

:: 2. Start Backend Express API (Port 5001)
echo.
echo [*] Starting Backend Server on http://localhost:5001 ...
start "FoodHub Backend Server (Port 5001)" cmd /k "cd /d "%~dp0server" && node server.js"

:: Wait for Backend API to become ready
ping -n 4 127.0.0.1 >nul

:: 3. Start Frontend React Client (Port 5173)
echo [*] Starting Frontend React Client on http://localhost:5173 ...
start "FoodHub Frontend Client (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

:: Wait for Vite to initialize
ping -n 4 127.0.0.1 >nul

:: 4. Launch Browser
echo.
echo [*] Opening application in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo [SUCCESS] FoodHub is running!
echo ========================================================
echo   - Customer Portal: http://localhost:5173
echo   - Backend API:     http://localhost:5001/api/health
echo.
echo   DEMO CREDENTIALS:
echo   - Customer: customer@foodhub.com / customer123
echo   - Admin:    admin@foodhub.com    / admin123
echo.
echo To STOP the application anytime, double-click 'end.bat'
echo ========================================================
echo.
pause
