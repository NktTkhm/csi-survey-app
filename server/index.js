const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./database');
const telegramBot = require('./telegram-bot');

const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация базы данных
db.init().catch(console.error);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Раздача статических файлов React приложения
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check для Railway
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Маршруты API

// Получение всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение пользователя по ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение проектов пользователя
app.get('/api/projects/:userId', async (req, res) => {
  try {
    const projects = await db.getUserProjects(req.params.userId);
    res.json(projects);
  } catch (error) {
    console.error('Ошибка получения проектов пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение всех вопросов
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await db.getQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Ошибка получения вопросов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Создание сессии опроса
app.post('/api/survey/session', async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    
    if (!userId || !projectId) {
      return res.status(400).json({ error: 'Необходимы userId и projectId' });
    }

    const session = await db.createSurveySession(userId, projectId);
    res.json(session);
  } catch (error) {
    console.error('Ошибка создания сессии опроса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Сохранение ответа на вопрос
app.post('/api/survey/response', async (req, res) => {
  try {
    const { sessionId, questionId, rating, comment } = req.body;
    
    if (!sessionId || !questionId || !rating) {
      return res.status(400).json({ error: 'Необходимы sessionId, questionId и rating' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' });
    }

    const response = await db.saveSurveyResponse(sessionId, questionId, rating, comment);
    res.json(response);
  } catch (error) {
    console.error('Ошибка сохранения ответа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Завершение опроса
app.post('/api/survey/complete', async (req, res) => {
  try {
    const { sessionId, totalScore } = req.body;
    
    if (!sessionId || !totalScore) {
      return res.status(400).json({ error: 'Необходимы sessionId и totalScore' });
    }

    await db.completeSurveySession(sessionId, totalScore);
    
    // Получаем результаты для отправки в Telegram
    const results = await db.getSurveyResults();
    await telegramBot.sendSurveyResults(results);
    
    res.json({ success: true, message: 'Опрос завершен' });
  } catch (error) {
    console.error('Ошибка завершения опроса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Админские маршруты

// Получение всех пользователей (только для админов)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Создание пользователя
app.post('/api/admin/users', async (req, res) => {
  try {
    const { name, email, is_admin = 0 } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Необходимы name и email' });
    }

    const user = await db.createUser({ name, email, is_admin });
    res.json(user);
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Обновление пользователя
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { name, email, is_active, is_admin } = req.body;
    const user = await db.updateUser(req.params.id, { name, email, is_active, is_admin });
    res.json(user);
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение всех проектов
app.get('/api/admin/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Ошибка получения проектов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Создание проекта
app.post('/api/admin/projects', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Необходимо название проекта' });
    }

    const project = await db.createProject({ name, description });
    res.json(project);
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Назначение пользователя на проект
app.post('/api/admin/user-projects', async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    
    if (!userId || !projectId) {
      return res.status(400).json({ error: 'Необходимы userId и projectId' });
    }

    const result = await db.assignUserToProject(userId, projectId);
    res.json(result);
  } catch (error) {
    console.error('Ошибка назначения пользователя на проект:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Удаление пользователя с проекта
app.delete('/api/admin/user-projects', async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    
    if (!userId || !projectId) {
      return res.status(400).json({ error: 'Необходимы userId и projectId' });
    }

    const result = await db.removeUserFromProject(userId, projectId);
    res.json(result);
  } catch (error) {
    console.error('Ошибка удаления пользователя с проекта:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение результатов опросов
app.get('/api/admin/survey-results', async (req, res) => {
  try {
    const results = await db.getSurveyResults();
    res.json(results);
  } catch (error) {
    console.error('Ошибка получения результатов опросов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Отправка результатов в Telegram
app.post('/api/admin/send-results', async (req, res) => {
  try {
    const results = await db.getSurveyResults();
    await telegramBot.sendSurveyResults(results);
    res.json({ success: true, message: 'Результаты отправлены в Telegram' });
  } catch (error) {
    console.error('Ошибка отправки результатов:', error);
    
    // Проверяем на rate limiting
    if (error.message && error.message.includes('Too many requests')) {
      res.status(429).json({ 
        error: 'Too many requests, please try again later',
        retryAfter: 60 // секунд
      });
    } else {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
  }
});

// Тест Telegram бота
app.post('/api/admin/test-telegram', async (req, res) => {
  try {
    const success = await telegramBot.testConnection();
    if (success) {
      res.json({ success: true, message: 'Telegram бот работает корректно' });
    } else {
      res.status(500).json({ error: 'Telegram бот не работает' });
    }
  } catch (error) {
    console.error('Ошибка тестирования Telegram бота:', error);
    
    // Проверяем на rate limiting
    if (error.message && error.message.includes('Too many requests')) {
      res.status(429).json({ 
        error: 'Too many requests, please try again later',
        retryAfter: 60 // секунд
      });
    } else {
      res.status(500).json({ error: 'Ошибка тестирования Telegram бота' });
    }
  }
});

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Необработанная ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Обработка всех остальных маршрутов - возвращаем React приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`🏥 Проверка здоровья: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM, закрытие сервера...');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Получен сигнал SIGINT, закрытие сервера...');
  db.close();
  process.exit(0);
});
