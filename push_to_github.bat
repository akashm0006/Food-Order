@echo off
title Push FoodHub to GitHub
color 0B
echo ========================================================
echo        PUSHING FOODHUB REPOSITORY TO GITHUB
echo ========================================================
echo.
echo Target Repository: https://github.com/akashm0006/Food-Order.git
echo Branch: main
echo.
git push origin main
echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Successfully pushed to GitHub!
) else (
    echo [ERROR] Push failed. Please check your internet connection or git status.
)
echo ========================================================
echo.
pause
