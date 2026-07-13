@echo off
where node >nul 2>nul || (echo Node.js 22 or newer is required. & pause & exit /b 1)
if not exist node_modules call npm install || exit /b 1
call npm start
