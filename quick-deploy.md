# ⚡ Быстрый деплой на Railway

## Шаг 1: Деплой (2 минуты)
1. Перейдите на [railway.app](https://railway.app)
2. Нажмите "Start a New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите репозиторий: `NktTkhm/csi-survey-app`

## Шаг 2: Настройка переменных (1 минута)
В Railway Dashboard → Variables добавьте:

```
PORT=5000
TELEGRAM_BOT_TOKEN=7760488085:AAHTUSXbuJSSSmET-UdSpEPG1AmsoZesIlA
ADMIN_CHAT_ID=7457987990
JWT_SECRET=mysecretkey123456789abcdef
DB_PATH=./database.sqlite
CORS_ORIGIN=https://ваш-домен.railway.app
```

## Шаг 3: Получение URL
После деплоя Railway даст URL вида:
`https://csi-survey-app-production-xxxx.up.railway.app`

## Шаг 4: Обновление CORS
1. Скопируйте ваш URL
2. В Variables замените `CORS_ORIGIN` на ваш URL
3. Railway перезапустит приложение

## Готово! 🎉
Ваше приложение: `https://ваш-домен.railway.app`
Админка: `https://ваш-домен.railway.app/admin`
