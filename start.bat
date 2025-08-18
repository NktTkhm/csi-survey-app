@echo off
chcp 65001 >nul

echo 🚀 Запуск приложения опросов системных аналитиков
echo ==================================================

REM Проверяем наличие Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен. Пожалуйста, установите Node.js 16+
    pause
    exit /b 1
)

echo ✅ Node.js найден

REM Проверяем наличие .env файла
if not exist "server\.env" (
    echo ⚠️  Файл server\.env не найден
    echo 📝 Создаем файл конфигурации...
    copy "server\env.example" "server\.env" >nul
    echo ✅ Файл server\.env создан
    echo ⚠️  Пожалуйста, отредактируйте server\.env и настройте переменные окружения
    echo    - TELEGRAM_BOT_TOKEN
    echo    - ADMIN_CHAT_ID
    echo    - JWT_SECRET
    pause
    exit /b 1
)

REM Устанавливаем зависимости если node_modules не существует
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    call npm run install-all
    if %errorlevel% neq 0 (
        echo ❌ Ошибка установки зависимостей
        pause
        exit /b 1
    )
    echo ✅ Зависимости установлены
)

REM Инициализируем базу данных если её нет
if not exist "server\database.sqlite" (
    echo 🗄️  Инициализируем базу данных...
    cd server
    call npm run init-db
    if %errorlevel% neq 0 (
        echo ❌ Ошибка инициализации базы данных
        pause
        exit /b 1
    )
    cd ..
    echo ✅ База данных инициализирована
)

REM Запускаем приложение
echo 🚀 Запускаем приложение...
echo 📱 Клиент: http://localhost:3000
echo 🔧 API: http://localhost:5000
echo 👨‍💼 Админ панель: http://localhost:3000/admin
echo.
echo Для остановки нажмите Ctrl+C
echo.

call npm run dev
