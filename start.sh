#!/bin/bash

# Скрипт для быстрого запуска приложения опросов системных аналитиков

echo "🚀 Запуск приложения опросов системных аналитиков"
echo "=================================================="

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 16+"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Проверяем наличие .env файла
if [ ! -f "server/.env" ]; then
    echo "⚠️  Файл server/.env не найден"
    echo "📝 Создаем файл конфигурации..."
    cp server/env.example server/.env
    echo "✅ Файл server/.env создан"
    echo "⚠️  Пожалуйста, отредактируйте server/.env и настройте переменные окружения"
    echo "   - TELEGRAM_BOT_TOKEN"
    echo "   - ADMIN_CHAT_ID"
    echo "   - JWT_SECRET"
    exit 1
fi

# Устанавливаем зависимости если node_modules не существует
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm run install-all
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка установки зависимостей"
        exit 1
    fi
    echo "✅ Зависимости установлены"
fi

# Инициализируем базу данных если её нет
if [ ! -f "server/database.sqlite" ]; then
    echo "🗄️  Инициализируем базу данных..."
    cd server && npm run init-db
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка инициализации базы данных"
        exit 1
    fi
    cd ..
    echo "✅ База данных инициализирована"
fi

# Запускаем приложение
echo "🚀 Запускаем приложение..."
echo "📱 Клиент: http://localhost:3000"
echo "🔧 API: http://localhost:5000"
echo "👨‍💼 Админ панель: http://localhost:3000/admin"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

npm run dev
