@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  where pnpm >nul 2>nul
  if not errorlevel 1 (
    echo Installing dependencies with pnpm...
    call pnpm install --frozen-lockfile
  ) else (
    echo Installing dependencies with npm...
    call npm install
  )
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Building the portfolio...
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo.
echo Build complete. The production files are in the dist folder.
pause
