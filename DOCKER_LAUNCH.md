# 🐳 Запуск CSI Survey App в Docker

## Предварительные требования

### 1. Установка Docker Desktop
- Скачайте и установите [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Запустите Docker Desktop
- Убедитесь, что Docker работает (иконка в трее должна быть зеленой)

### 2. Проверка установки
```bash
docker --version
docker-compose --version
```

## 🚀 Быстрый запуск

### Вариант 1: Автоматический запуск (Windows)
1. Дважды кликните на файл `docker-start.bat`
2. Дождитесь завершения сборки и запуска
3. Откройте браузер: **http://localhost:5000**

### Вариант 2: Ручной запуск
```bash
# Сборка и запуск
docker-compose up --build

# Или в фоновом режиме
docker-compose up --build -d
```

## 📋 Что происходит при запуске

1. **Сборка образа** - Docker создает образ приложения
2. **Установка зависимостей** - npm install для server и client
3. **Сборка клиента** - React приложение компилируется
4. **Инициализация БД** - SQLite база данных создается с тестовыми данными
5. **Запуск сервера** - Node.js сервер стартует на порту 5000

## 🌐 Доступ к приложению

- **Основное приложение**: http://localhost:5000
- **API endpoints**: http://localhost:5000/api/*
- **Health check**: http://localhost:5000/api/health

## 🔧 Управление контейнером

### Просмотр логов
```bash
docker-compose logs -f
```

### Остановка приложения
```bash
docker-compose down
```

### Перезапуск
```bash
docker-compose restart
```

### Полная очистка
```bash
docker-compose down -v
docker system prune -f
```

## 📁 Структура файлов

```
csi_sa/
├── docker-compose.yml    # Конфигурация Docker Compose
├── Dockerfile           # Инструкции для сборки образа
├── docker.env           # Переменные окружения
├── docker-start.bat     # Скрипт запуска для Windows
└── DOCKER_LAUNCH.md     # Эта инструкция
```

## ⚙️ Настройка переменных окружения

Отредактируйте файл `docker.env` для изменения настроек:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=ваш_токен_бота
ADMIN_CHAT_ID=ваш_chat_id

# JWT секрет
JWT_SECRET=ваш_секретный_ключ

# Порт
PORT=5000
```

## 🐛 Решение проблем

### Ошибка "Docker is not running"
- Запустите Docker Desktop
- Дождитесь полной загрузки (зеленая иконка)

### Ошибка "Port already in use"
```bash
# Найдите процесс на порту 5000
netstat -ano | findstr :5000

# Остановите процесс или измените порт в docker-compose.yml
```

### Ошибка сборки
```bash
# Очистите кэш Docker
docker system prune -f

# Пересоберите образ
docker-compose build --no-cache
```

### Проблемы с базой данных
```bash
# Удалите файл БД и пересоздайте
rm server/database.sqlite
docker-compose up --build
```

## 📊 Мониторинг

### Статус контейнеров
```bash
docker-compose ps
```

### Использование ресурсов
```bash
docker stats
```

### Логи в реальном времени
```bash
docker-compose logs -f csi-survey
```

## 🔄 Обновление приложения

1. Остановите контейнер: `docker-compose down`
2. Получите обновления: `git pull`
3. Пересоберите: `docker-compose up --build`

## ✅ Проверка работоспособности

После запуска проверьте:

1. **Главная страница**: http://localhost:5000
2. **API health**: http://localhost:5000/api/health
3. **Выбор пользователя**: должен отображаться список
4. **Админ панель**: доступна по ссылке внизу страницы

## 🎯 Готово!

Приложение запущено и готово к использованию! 

- **URL**: http://localhost:5000
- **Telegram Bot**: настроен и готов к отправке результатов
- **База данных**: инициализирована с тестовыми данными

