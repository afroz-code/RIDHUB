@echo off
setlocal
cd /d %~dp0
echo =====================================
echo       RIDE HUB - FIRST SETUP
echo =====================================
echo.
if not exist server\.env copy server\.env.example server\.env
echo Installing root dependencies...
npm install
if errorlevel 1 goto fail
echo Installing server dependencies...
npm install --prefix server
if errorlevel 1 goto fail
echo Installing client dependencies...
npm install --prefix client
if errorlevel 1 goto fail
echo.
echo Setup complete.
echo 1. Edit server\.env with your MySQL password.
echo 2. Run server\schema.sql in MySQL.
echo 3. Run START-RIDE-HUB.bat
pause
exit /b 0
:fail
echo.
echo Dependency installation failed. Check your internet connection and Node.js installation.
pause
exit /b 1
