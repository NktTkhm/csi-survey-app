@echo off
echo ========================================
echo    Деплой CSI Survey App на Railway
echo ========================================
echo.

echo 1. Проверяем наличие Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git не установлен! Скачайте с https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git найден

echo.
echo 2. Инициализируем Git репозиторий...
if not exist .git (
    git init
    echo ✅ Git репозиторий создан
) else (
    echo ✅ Git репозиторий уже существует
)

echo.
echo 3. Добавляем файлы в Git...
git add .
git commit -m "Deploy to Railway" >nul 2>&1
echo ✅ Файлы добавлены в Git

echo.
echo ========================================
echo    СЛЕДУЮЩИЕ ШАГИ:
echo ========================================
echo.
echo 1. Создайте репозиторий на GitHub:
echo    - Перейдите на https://github.com
echo    - Нажмите "New repository"
echo    - Назовите его "csi-survey-app"
echo    - НЕ ставьте галочки (README, .gitignore, license)
echo    - Нажмите "Create repository"
echo.
echo 2. Загрузите код в GitHub:
echo    git remote add origin https://github.com/ВАШ_USERNAME/csi-survey-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Создайте Telegram бота:
echo    - Найдите @BotFather в Telegram
echo    - Отправьте /newbot
echo    - Следуйте инструкциям
echo    - Скопируйте токен
echo.
echo 4. Получите Chat ID:
echo    - Найдите @userinfobot в Telegram
echo    - Отправьте любое сообщение
echo    - Скопируйте ваш Chat ID
echo.
echo 5. Деплой на Railway:
echo    - Перейдите на https://railway.app
echo    - Нажмите "Start a New Project"
echo    - Выберите "Deploy from GitHub repo"
echo    - Выберите ваш репозиторий
echo.
echo 6. Настройте переменные окружения в Railway:
echo    PORT=5000
echo    TELEGRAM_BOT_TOKEN=ваш_токен
echo    ADMIN_CHAT_ID=ваш_chat_id
echo    JWT_SECRET=случайная_строка
echo    DB_PATH=./database.sqlite
echo    CORS_ORIGIN=https://ваш-домен.railway.app
echo.
echo Подробная инструкция в файле: railway-deploy.md
echo.
pause

