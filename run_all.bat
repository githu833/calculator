@echo off
SET PATH=%PATH%;C:\Program Files\nodejs
title Capitalize Pro - Launcher

echo ==============================================
echo        CAPITALIZE PRO - APP LAUNCHER
echo ==============================================

echo [1/3] Checking environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not found in the path. 
    echo Please install it from nodejs.org or check C:\Program Files\nodejs
    pause
    exit
)

echo [2/3] Starting Backend API...
start "Backend Server" cmd /k "cd backend && npm start"

echo [3/3] Starting Frontend UI...
start "Frontend UI" cmd /k "cd frontend && npm run dev"

echo ==============================================
echo ✅ Launch sequences initiated!
echo ----------------------------------------------
echo IMPORTANT: 
echo 1. Ensure MongoDB is running locally.
echo 2. Frontend: http://localhost:5173
echo 3. API: http://localhost:5000/api
echo ==============================================
pause
