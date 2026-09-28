@echo off
title Flask Backend Server
cd /d "%~dp0\backend"
echo ============================================================
echo Starting Flask Backend on http://localhost:8000 ...
echo ============================================================
python app.py
pause
