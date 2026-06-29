@echo off
title TrialShopy Virtual Try-On Server
echo.
echo ============================================================
echo  TrialShopy Virtual Try-On Bridge Server
echo  Powered by CatVTON (Hugging Face Space)
echo ============================================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

REM Install / upgrade dependencies silently
echo [1/2] Installing Python dependencies...
pip install -q -r tryon_requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

echo [2/2] Starting Virtual Try-On server on http://127.0.0.1:8000
echo.
echo  - Ctrl+C to stop the server
echo  - Keep this window open while using Virtual Try-On
echo.

REM Optional: set HF_TOKEN if you have one (for private spaces or rate limits)
REM set HF_TOKEN=hf_your_token_here

REM Optional: change cloth type (upper / lower / overall)
REM set CLOTH_TYPE=upper

python tryon_server.py

echo.
echo Server stopped.
pause
