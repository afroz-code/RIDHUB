@echo off
cd /d %~dp0
start "Ride Hub API" cmd /k "npm run dev --prefix server"
start "Ride Hub Frontend" cmd /k "npm run dev --prefix client"
timeout /t 3 >nul
start http://localhost:5173
