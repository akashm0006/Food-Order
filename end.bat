@echo off
title FoodHub MERN Stack - Stopper
color 0C

echo ========================================================
echo        STOPPING FOODHUB FOOD ORDERING SYSTEM
echo ========================================================
echo.

:: 1. Terminate Backend process on Port 5001
echo [*] Stopping Backend process on port 5001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001" ^| findstr "LISTENING"') do (
    echo [*] Terminating Backend PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: 2. Terminate Frontend process on Port 5173
echo [*] Stopping Frontend process on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [*] Terminating Frontend PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

:: 3. Terminate local mongod if started via start.bat
taskkill /F /FI "WINDOWTITLE eq FoodHub Database (MongoDB)*" >nul 2>&1

:: 4. Close any open FoodHub command windows
taskkill /F /FI "WINDOWTITLE eq FoodHub Backend Server (Port 5001)*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq FoodHub Frontend Client (Port 5173)*" >nul 2>&1

echo.
echo ========================================================
echo [SUCCESS] FoodHub services have been stopped safely.
echo ========================================================
echo.
echo To start again, double-click 'start.bat'.
echo.
ping -n 3 127.0.0.1 >nul
exit /b 0
