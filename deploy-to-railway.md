# 🚀 Деплой на Railway

## Шаг 1: Регистрация на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Нажмите "Start a New Project"
3. Выберите "Deploy from GitHub repo"
4. Подключите ваш GitHub аккаунт
5. Выберите репозиторий: `NktTkhm/csi-survey-app`

## Шаг 2: Настройка переменных окружения

В Railway Dashboard → Variables добавьте:

```
PORT=5000
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
ADMIN_CHAT_ID=ваш_chat_id_от_userinfobot
JWT_SECRET=mysecretkey123456789
DB_PATH=./database.sqlite
CORS_ORIGIN=https://ваш-домен.railway.app
```

## Шаг 3: Получение URL

После деплоя Railway даст URL вида:
`https://csi-survey-app-production-xxxx.up.railway.app`

## Шаг 4: Обновление CORS_ORIGIN

1. Скопируйте ваш URL
2. В Variables найдите `CORS_ORIGIN`
3. Замените значение на ваш URL
4. Railway автоматически перезапустит приложение

## Шаг 5: Тестирование

1. Откройте ваш URL в браузере
2. Перейдите на `/admin`
3. Добавьте пользователей и проекты
4. Протестируйте опрос

## Готово! 🎉

Ваше приложение доступно по адресу:
`https://ваш-домен.railway.app`
