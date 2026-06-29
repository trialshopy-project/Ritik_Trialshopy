@echo off

set PROJECT_ROOT=C:\trailshopy

echo Killing process on port 7000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":7000" ^| findstr LISTENING') do taskkill /F /PID %%a

echo Killing process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr LISTENING') do taskkill /F /PID %%a

timeout /t 2 >nul

echo Starting Customer Backend...
start "Customer Backend" cmd /k "cd /d %PROJECT_ROOT%\Trialshopy-backend-master && node dist/server.js"

timeout /t 2 >nul

echo Starting Seller Backend...
start "Seller Backend" cmd /k "cd /d %PROJECT_ROOT%\Seller-Admin-Backend-main && npm run dev"

timeout /t 2 >nul

echo Starting Customer Frontend...
start "Customer Frontend" cmd /k "cd /d %PROJECT_ROOT%\Trialshopy_Frontend_25-main && npm run dev"

timeout /t 2 >nul

echo Starting Seller Frontend...
start "Seller Frontend" cmd /k "cd /d %PROJECT_ROOT%\SELLER-ADMIN-DASHBOARD-main && npm run dev"

timeout /t 2 >nul

echo Starting Super Admin...
start "Super Admin" cmd /k "cd /d %PROJECT_ROOT%\Super-Admin-main && npm run dev"

echo.
echo ============================================
echo All services started successfully.
echo ============================================

pause

