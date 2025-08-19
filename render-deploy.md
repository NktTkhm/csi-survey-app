# 🌐 Деплой на Render

## ✅ Все готово для деплоя на Render!

### Настройки:
- **GitHub репозиторий**: `NktTkhm/csi-survey-app`
- **Telegram бот**: `7760488085:AAHTUSXbuJSSSmET-UdSpEPG1AmsoZesIlA`
- **Chat ID**: `7457987990`

## 📋 Пошаговая инструкция:

### Шаг 1: Регистрация на Render
1. Перейдите на [render.com](https://render.com)
2. Нажмите "Get Started for Free"
3. Войдите через GitHub аккаунт
4. Подтвердите доступ к репозиториям

### Шаг 2: Создание Web Service
1. Нажмите "New" → "Web Service"
2. Подключите GitHub репозиторий: `NktTkhm/csi-survey-app`
3. Настройте параметры:
   - **Name**: `csi-survey-app`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` (или ближайший к вам)
   - **Branch**: `main`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Шаг 3: Настройка переменных окружения
В разделе "Environment Variables" добавьте:

```
PORT=5000
TELEGRAM_BOT_TOKEN=7760488085:AAHTUSXbuJSSSmET-UdSpEPG1AmsoZesIlA
ADMIN_CHAT_ID=7457987990
JWT_SECRET=mysecretkey123456789abcdef
DB_PATH=./database.sqlite
CORS_ORIGIN=https://ваш-домен.onrender.com
```

### Шаг 4: Деплой
1. Нажмите "Create Web Service"
2. Render автоматически начнет деплой
3. Дождитесь завершения (5-10 минут)

### Шаг 5: Получение URL
После успешного деплоя Render даст URL вида:
`https://csi-survey-app.onrender.com`

### Шаг 6: Обновление CORS_ORIGIN
1. Скопируйте ваш URL
2. В Environment Variables найдите `CORS_ORIGIN`
3. Замените значение на ваш URL
4. Render автоматически перезапустит приложение

## 🎉 Готово!

### Ваше приложение:
- **Главная страница**: `https://ваш-домен.onrender.com`
- **Админка**: `https://ваш-домен.onrender.com/admin`
- **API**: `https://ваш-домен.onrender.com/api/health`

### Что делать дальше:
1. **Откройте админку** (`/admin`)
2. **Добавьте пользователей** (ваши сотрудники)
3. **Добавьте проекты** (ваши проекты)
4. **Назначьте пользователей на проекты**
5. **Отправьте ссылку сотрудникам**

## 📱 Отправка ссылки сотрудникам

Теперь вы можете отправлять ссылку:
`https://ваш-домен.onrender.com`

Сотрудники смогут:
1. Выбрать свое имя из списка
2. Выбрать проект
3. Пройти опрос (13 вопросов)
4. Результаты автоматически придут вам в Telegram в формате Excel

## 🆘 Если что-то пошло не так

### Ошибка "Build failed":
- Проверьте логи в Render Dashboard
- Убедитесь, что все переменные окружения настроены
- Проверьте, что Build Command корректный

### Результаты не приходят в Telegram:
- Проверьте, что бот активен
- Убедитесь, что Chat ID правильный
- Проверьте логи в Render Dashboard

### Ошибка "Application error":
- Проверьте переменные окружения
- Убедитесь, что все значения корректные
- Проверьте Start Command

## 🎯 Результат

После выполнения всех шагов у вас будет полностью рабочее приложение для проведения опросов с автоматической отправкой результатов в Telegram!

