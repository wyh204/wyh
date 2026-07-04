@echo off
set "PATH=E:\nodejs;%PATH%"

echo ==============================
echo   GLUT Aing Education
echo ==============================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b
)
echo [OK] Node.js detected

if not exist "node_modules\" (
    echo [!] Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERR] npm install failed
        pause
        exit /b
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies ready
)

echo [OK] Starting dev server...
echo Open http://localhost:3000 in browser
echo Press Ctrl+C to stop
echo.

start "" http://localhost:3000
npx next dev -p 3000
pause
