# 🚀 Инструкция по деплою CSI Survey App

## 🛤️ Railway (Рекомендуется - самый простой)

### Шаг 1: Подготовка
1. Убедитесь, что у вас есть аккаунт на [railway.app](https://railway.app)
2. Установите Railway CLI (опционально):
   ```bash
   npm install -g @railway/cli
   ```

### Шаг 2: Деплой через GitHub
1. Загрузите код в GitHub репозиторий
2. Перейдите на [railway.app](https://railway.app)
3. Нажмите "New Project" → "Deploy from GitHub repo"
4. Выберите ваш репозиторий
5. Railway автоматически определит, что это Node.js проект

### Шаг 3: Настройка переменных окружения
В Railway Dashboard → Variables добавьте:
```
PORT=5000
TELEGRAM_BOT_TOKEN=ваш_токен_бота
ADMIN_CHAT_ID=ваш_chat_id
JWT_SECRET=случайная_строка_для_безопасности
DB_PATH=./database.sqlite
CORS_ORIGIN=https://ваш-домен.railway.app
```

### Шаг 4: Деплой
Railway автоматически запустит:
1. `npm install` (установка зависимостей)
2. `npm run build` (сборка клиента)
3. `npm run init-db` (инициализация БД)
4. `npm start` (запуск приложения)

### Шаг 5: Получение URL
После деплоя Railway даст вам URL вида:
`https://csi-survey-app-production-xxxx.up.railway.app`

---

## 🌐 Render (Бесплатный альтернативный вариант)

### Шаг 1: Подготовка
1. Зарегистрируйтесь на [render.com](https://render.com)
2. Подключите GitHub аккаунт

### Шаг 2: Создание Web Service
1. Нажмите "New" → "Web Service"
2. Подключите ваш GitHub репозиторий
3. Настройте:
   - **Name**: `csi-survey-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Шаг 3: Переменные окружения
Добавьте те же переменные, что и для Railway

### Шаг 4: Деплой
Render автоматически развернет приложение

---

## 🐳 Heroku (Классический вариант)

### Шаг 1: Подготовка
1. Установите [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Зарегистрируйтесь на [heroku.com](https://heroku.com)

### Шаг 2: Создание приложения
```bash
heroku create csi-survey-app
```

### Шаг 3: Настройка переменных
```bash
heroku config:set TELEGRAM_BOT_TOKEN=ваш_токен_бота
heroku config:set ADMIN_CHAT_ID=ваш_chat_id
heroku config:set JWT_SECRET=случайная_строка
heroku config:set CORS_ORIGIN=https://ваш-приложение.herokuapp.com
```

### Шаг 4: Деплой
```bash
git add .
git commit -m "Initial deployment"
git push heroku main
```

---

## 🖥️ VPS (Полный контроль)

### Шаг 1: Выбор VPS
Рекомендуемые провайдеры:
- **DigitalOcean** (от $5/месяц)
- **Linode** (от $5/месяц)
- **Vultr** (от $2.50/месяц)

### Шаг 2: Настройка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt install nginx -y
```

### Шаг 3: Загрузка кода
```bash
# Клонирование репозитория
git clone https://github.com/ваш-username/csi-survey-app.git
cd csi-survey-app

# Установка зависимостей
npm run install-all

# Настройка переменных окружения
cp server/.env.example server/.env
nano server/.env
```

### Шаг 4: Настройка Nginx
```bash
sudo nano /etc/nginx/sites-available/csi-survey-app
```

Содержимое файла:
```nginx
server {
    listen 80;
    server_name ваш-домен.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Шаг 5: Запуск
```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/csi-survey-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Запуск приложения через PM2
pm2 start npm --name "csi-survey-app" -- start
pm2 startup
pm2 save
```

---

## 🔧 Настройка Telegram бота

### Получение токена бота:
1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен

### Получение Chat ID:
1. Найдите @userinfobot в Telegram
2. Отправьте любое сообщение
3. Скопируйте ваш Chat ID

---

## 🌍 Настройка домена (опционально)

### Для Railway/Render:
1. В настройках проекта добавьте Custom Domain
2. Укажите ваш домен
3. Обновите CORS_ORIGIN в переменных окружения

### Для VPS:
1. Настройте DNS записи на ваш сервер
2. Обновите Nginx конфигурацию
3. Установите SSL сертификат (Let's Encrypt)

---

## ✅ Проверка работоспособности

После деплоя проверьте:
1. **Главная страница**: `https://ваш-домен.com`
2. **Админка**: `https://ваш-домен.com/admin`
3. **API**: `https://ваш-домен.com/api/health`
4. **Telegram**: Отправьте тестовый опрос

---

## 🆘 Устранение проблем

### Ошибка "Build failed":
- Проверьте логи сборки
- Убедитесь, что все зависимости указаны в package.json

### Ошибка "Application error":
- Проверьте переменные окружения
- Убедитесь, что Telegram токен корректный

### Ошибка "Database not found":
- Проверьте, что `npm run init-db` выполнился успешно
- Убедитесь, что у приложения есть права на запись

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в панели управления хостингом
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что Telegram бот активен
