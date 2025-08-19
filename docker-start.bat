@echo off
echo ========================================
echo    CSI Survey App - Docker Launch
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Docker is installed.
echo.

echo Checking Docker Desktop status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running!
    echo.
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo.
    echo Please wait for Docker Desktop to start completely (green icon in tray).
    echo Then run this script again.
    pause
    exit /b 1
)

echo Docker Desktop is running!
echo.

echo Building and starting the application...
echo This may take a few minutes on first run...
echo.

docker-compose up --build

echo.
echo Application stopped.
pause
