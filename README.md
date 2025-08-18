# Опрос системных аналитиков - Веб-приложение

Веб-приложение для проведения опросов системных аналитиков с интеграцией Telegram бота и админ панелью.

## 🚀 Возможности

- **Прохождение опросов**: Пользователи могут проходить опросы по оценке работы системных аналитиков
- **Оценка по шкале 1-5**: Каждый вопрос оценивается по 5-балльной шкале
- **Комментарии**: Возможность оставлять дополнительные комментарии к каждому ответу
- **Telegram интеграция**: Автоматическая отправка результатов в Excel формате
- **Админ панель**: Управление пользователями, проектами и просмотр результатов
- **Современный UI**: Красивый и адаптивный интерфейс на React + Tailwind CSS

## 📋 Требования

- Node.js 16+ 
- npm или yarn
- Telegram Bot Token (получить у @BotFather)
- Ваш Telegram Chat ID

## 🛠 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd csi_sa
```

### 2. Установка зависимостей

```bash
# Установка всех зависимостей (сервер + клиент)
npm run install-all
```

### 3. Настройка Telegram бота

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Узнайте ваш Chat ID (можно использовать @userinfobot)

### 4. Настройка переменных окружения

Скопируйте файл конфигурации:

```bash
cp server/env.example server/.env
```

Отредактируйте `server/.env`:

```env
# Порт сервера
PORT=5000

# Telegram Bot Token (получить у @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# ID чата для получения результатов (ваш Telegram ID)
ADMIN_CHAT_ID=your_telegram_chat_id_here

# JWT Secret для авторизации
JWT_SECRET=your_jwt_secret_here

# База данных
DB_PATH=./database.sqlite

# CORS настройки
CORS_ORIGIN=http://localhost:3000
```

### 5. Инициализация базы данных

```bash
cd server
npm run init-db
```

### 6. Запуск приложения

#### Режим разработки (одновременно сервер + клиент)
```bash
npm run dev
```

#### Отдельный запуск
```bash
# Сервер
npm run server

# Клиент (в другом терминале)
npm run client
```

## 🌐 Доступ к приложению

- **Основное приложение**: http://localhost:3000
- **Админ панель**: http://localhost:3000/admin
- **API сервер**: http://localhost:5000

## 📱 Использование

### Для пользователей

1. Откройте ссылку на приложение
2. Выберите своего пользователя из списка
3. Выберите проект, на котором работаете
4. Ответьте на все вопросы (оценка 1-5 + комментарии)
5. Нажмите "Завершить опрос"

### Для администраторов

1. Перейдите в админ панель: `/admin`
2. Управляйте пользователями и проектами
3. Назначайте пользователей на проекты
4. Просматривайте результаты опросов
5. Отправляйте результаты в Telegram

## 🚀 Развертывание в продакшене

### Вариант 1: VPS/Сервер

#### Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2 для управления процессами
sudo npm install -g pm2

# Установка Nginx
sudo apt install nginx -y
```

#### Развертывание приложения

```bash
# Клонирование проекта
git clone <repository-url>
cd csi_sa

# Установка зависимостей
npm run install-all

# Настройка переменных окружения
cp server/env.example server/.env
# Отредактируйте .env файл

# Инициализация базы данных
cd server && npm run init-db

# Сборка клиентского приложения
cd ../client && npm run build

# Запуск сервера через PM2
cd ../server
pm2 start index.js --name "csi-survey-server"
pm2 startup
pm2 save
```

#### Настройка Nginx

Создайте конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/csi-survey
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Клиентское приложение
    location / {
        root /path/to/csi_sa/client/build;
        try_files $uri $uri/ /index.html;
    }

    # API сервер
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/csi-survey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Вариант 2: Heroku

#### Подготовка

1. Создайте аккаунт на Heroku
2. Установите Heroku CLI

#### Развертывание

```bash
# Логин в Heroku
heroku login

# Создание приложения
heroku create your-app-name

# Настройка переменных окружения
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set ADMIN_CHAT_ID=your_chat_id
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Развертывание
git push heroku main

# Открытие приложения
heroku open
```

### Вариант 3: Docker

#### Создание Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копирование package.json файлов
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Установка зависимостей
RUN npm run install-all

# Копирование исходного кода
COPY . .

# Сборка клиентского приложения
RUN cd client && npm run build

# Инициализация базы данных
RUN cd server && npm run init-db

# Открытие портов
EXPOSE 5000

# Запуск приложения
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  csi-survey:
    build: .
    ports:
      - "5000:5000"
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - ADMIN_CHAT_ID=${ADMIN_CHAT_ID}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./server/database.sqlite:/app/server/database.sqlite
```

```bash
# Запуск
docker-compose up -d
```

## 📊 Структура проекта

```
csi_sa/
├── server/                 # Backend (Node.js + Express)
│   ├── index.js           # Основной сервер
│   ├── database.js        # Работа с БД
│   ├── telegram-bot.js    # Telegram бот
│   ├── init-db.js         # Инициализация БД
│   └── package.json
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── App.js         # Основной компонент
│   │   └── index.js       # Точка входа
│   └── package.json
├── package.json           # Корневой package.json
└── README.md
```

## 🔧 API Endpoints

### Пользователи
- `GET /api/users/:id` - Получение пользователя
- `GET /api/users/:id/projects` - Проекты пользователя

### Опросы
- `GET /api/questions` - Получение вопросов
- `POST /api/survey/session` - Создание сессии
- `POST /api/survey/response` - Сохранение ответа
- `POST /api/survey/complete` - Завершение опроса

### Админ API
- `GET /api/admin/users` - Все пользователи
- `POST /api/admin/users` - Создание пользователя
- `PUT /api/admin/users/:id` - Обновление пользователя
- `GET /api/admin/projects` - Все проекты
- `POST /api/admin/projects` - Создание проекта
- `POST /api/admin/user-projects` - Назначение на проект
- `DELETE /api/admin/user-projects` - Удаление с проекта
- `GET /api/admin/survey-results` - Результаты опросов
- `POST /api/admin/send-results` - Отправка в Telegram

## 🛡 Безопасность

- Rate limiting для API
- CORS настройки
- Helmet для защиты заголовков
- Валидация входных данных
- SQLite с параметризованными запросами

## 🔄 Обновление приложения

```bash
# Остановка приложения
pm2 stop csi-survey-server

# Обновление кода
git pull origin main

# Установка новых зависимостей
npm run install-all

# Сборка клиента
cd client && npm run build

# Перезапуск
pm2 restart csi-survey-server
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `pm2 logs csi-survey-server`
2. Убедитесь в правильности настроек в `.env`
3. Проверьте подключение к базе данных
4. Убедитесь в работоспособности Telegram бота

## 📝 Лицензия

MIT License
