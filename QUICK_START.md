# 🚀 Быстрый запуск приложения

## 📋 Предварительные требования

1. **Node.js 16+** - [Скачать](https://nodejs.org/)
2. **Telegram Bot Token** - получить у @BotFather
3. **Ваш Telegram Chat ID** - узнать через @userinfobot

## ⚡ Быстрый запуск

### Windows
```bash
# Двойной клик на файл start.bat
# ИЛИ в командной строке:
start.bat
```

### Linux/Mac
```bash
# Сделать скрипт исполняемым
chmod +x start.sh

# Запустить
./start.sh
```

### Ручной запуск
```bash
# 1. Установка зависимостей
npm run install-all

# 2. Настройка конфигурации
cp server/env.example server/.env
# Отредактируйте server/.env

# 3. Инициализация БД
cd server && npm run init-db && cd ..

# 4. Запуск
npm run dev
```

## ⚙️ Настройка конфигурации

Отредактируйте файл `server/.env`:

```env
# Telegram Bot Token (получить у @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# ID чата для получения результатов (ваш Telegram ID)
ADMIN_CHAT_ID=your_telegram_chat_id_here

# JWT Secret для авторизации
JWT_SECRET=your_jwt_secret_here
```

## 🌐 Доступ к приложению

- **Основное приложение**: http://localhost:3000
- **Админ панель**: http://localhost:3000/admin
- **API сервер**: http://localhost:5000

## 📱 Первые шаги

1. Откройте админ панель: http://localhost:3000/admin
2. Добавьте пользователей и проекты
3. Назначьте пользователей на проекты
4. Отправьте ссылку на приложение сотрудникам

## 🆘 Если что-то не работает

1. Проверьте логи в консоли
2. Убедитесь, что все переменные в `.env` настроены
3. Проверьте, что Telegram бот работает
4. Убедитесь, что порты 3000 и 5000 свободны

## 📞 Поддержка

Подробная документация: [README.md](README.md)
