@echo off
title FastAPI Backend Server
cd /d "%~dp0\backend"
echo ============================================================
echo Starting FastAPI Backend on http://localhost:8000 ...
echo Interactive Docs: http://localhost:8000/docs
echo ============================================================
python main.py
pause
