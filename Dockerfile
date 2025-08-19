# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Устанавливаем зависимости
RUN npm run install-all

# Копируем исходный код
COPY . .

# Создаем папку для временных файлов
RUN mkdir -p server/temp

# Собираем клиентское приложение
RUN cd client && npm run build

# Открываем порт
EXPOSE 5000

# Устанавливаем переменные окружения по умолчанию
ENV NODE_ENV=production
ENV PORT=5000

# Запускаем приложение
CMD ["npm", "start"]
