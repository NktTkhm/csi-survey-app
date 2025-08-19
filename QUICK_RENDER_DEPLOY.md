# ⚡ Быстрый деплой на Render

## 🚀 Деплой за 3 минуты!

### Шаг 1: Регистрация
1. Перейдите на [render.com](https://render.com)
2. Нажмите "Get Started for Free"
3. Войдите через GitHub

### Шаг 2: Создание Web Service
1. Нажмите "New" → "Web Service"
2. Выберите репозиторий: `NktTkhm/csi-survey-app`
3. Настройте:
   - **Name**: `csi-survey-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Шаг 3: Переменные окружения
В Environment Variables добавьте:

```
PORT=5000
TELEGRAM_BOT_TOKEN=7760488085:AAHTUSXbuJSSSmET-UdSpEPG1AmsoZesIlA
ADMIN_CHAT_ID=7457987990
JWT_SECRET=mysecretkey123456789abcdef
DB_PATH=./database.sqlite
CORS_ORIGIN=https://csi-survey-app.onrender.com
```

### Шаг 4: Деплой
1. Нажмите "Create Web Service"
2. Дождитесь завершения (5-10 минут)

### Шаг 5: Обновление CORS
1. Скопируйте ваш URL
2. В Environment Variables замените `CORS_ORIGIN` на ваш URL

## 🎉 Готово!

Ваше приложение: `https://ваш-домен.onrender.com`
Админка: `https://ваш-домен.onrender.com/admin`

## 📱 Что дальше:
1. Откройте админку
2. Добавьте пользователей и проекты
3. Отправьте ссылку сотрудникам

