@echo off
echo ========================================
echo    Docker Status Check
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

echo Testing Docker connection...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to Docker daemon!
    echo Please make sure Docker Desktop is fully started.
    pause
    exit /b 1
)

echo Docker is ready!
echo.
echo You can now run: docker-compose up --build
pause

