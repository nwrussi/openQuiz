@echo off
REM OpenQuiz Launcher for Windows
REM Double-click this file to start OpenQuiz

echo.
echo ========================================
echo    Starting OpenQuiz
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes on first run.
    echo.
    call npm install
    echo.
)

REM Start the launcher
echo Starting server...
node launcher.js

pause
