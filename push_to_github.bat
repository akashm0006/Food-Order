@echo off
title Push FoodHub to GitHub
color 0B
echo ========================================================
echo        PUSHING FOODHUB REPOSITORY TO GITHUB
echo ========================================================
echo.
echo Target Repository: https://github.com/ansariaaug24it-tech/Food-Order-Management-System.git
echo Branch: main
echo.
echo Git Credential Manager will open a browser window for you to
echo sign in as ansariaaug24it-tech (if not already authenticated).
echo.
git push -u origin main
echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Successfully pushed to GitHub!
) else (
    echo [INFO] If you prefer using a Personal Access Token (PAT):
    echo Run:
    echo   git remote set-url origin https://^<YOUR_GITHUB_TOKEN^>@github.com/ansariaaug24it-tech/Food-Order-Management-System.git
    echo   git push -u origin main
)
echo ========================================================
echo.
pause
