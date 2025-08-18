const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Вопросы для опроса
const questions = [
  "Насколько системный аналитик помогает команде избежать недопонимания и ошибок при разработке функциональности?",
  "Насколько удобно вам взаимодействовать с системным аналитиком вашего проекта?",
  "Насколько, на ваш взгляд, системный аналитик способствует эффективному командному взаимодействию?",
  "Насколько, на ваш взгляд, системный аналитик понятно и полно формулирует требования?",
  "Насколько, на ваш взгляд, системный аналитик эффективно передает требования между различными ролями (разработчики, тестировщики, менеджеры)?",
  "Насколько, на ваш взгляд, системный аналитик открыт к обсуждению и разъяснению требований?",
  "Насколько глубоко системный аналитик понимает специфику проекта и его бизнес-цели?",
  "Насколько быстро системный аналитик реагирует на изменения в проекте?",
  "Насколько качественно подготовлена документация на проекте (описание функциональности, логика работы, спецификации и т. д.)?",
  "Насколько работа системного аналитика способствует своевременной реализации проекта?",
  "Насколько, на ваш взгляд, системный аналитик вовлечен в работу над проектом?",
  "Насколько работа системного аналитика снижает неопределенность и риски в проекте?",
  "Оцените в целом выполнение функций системного анализа на проекте?"
];

// Примеры проектов
const projects = [
  "Проект А - CRM система",
  "Проект Б - Мобильное приложение",
  "Проект В - Веб-портал",
  "Проект Г - API сервис",
  "Проект Д - Аналитическая платформа"
];

db.serialize(() => {
  console.log('Инициализация базы данных...');

  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    is_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Таблица проектов
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Таблица вопросов
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    order_num INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Таблица доступа пользователей к проектам
  db.run(`CREATE TABLE IF NOT EXISTS user_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id),
    UNIQUE(user_id, project_id)
  )`);

  // Таблица ответов
  db.run(`CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
  )`);

  // Таблица сессий опросов
  db.run(`CREATE TABLE IF NOT EXISTS survey_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    total_score REAL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (project_id) REFERENCES projects (id)
  )`);

  // Добавляем вопросы
  console.log('Добавление вопросов...');
  const insertQuestion = db.prepare('INSERT OR IGNORE INTO questions (text, order_num) VALUES (?, ?)');
  questions.forEach((question, index) => {
    insertQuestion.run(question, index + 1);
  });
  insertQuestion.finalize();

  // Добавляем проекты
  console.log('Добавление проектов...');
  const insertProject = db.prepare('INSERT OR IGNORE INTO projects (name, description) VALUES (?, ?)');
  projects.forEach(project => {
    insertProject.run(project, `Описание для ${project}`);
  });
  insertProject.finalize();

  // Добавляем админа
  console.log('Добавление администратора...');
  db.run(`INSERT OR IGNORE INTO users (name, email, is_admin) VALUES (?, ?, ?)`, 
    ['Администратор', 'admin@example.com', 1]);

  console.log('База данных успешно инициализирована!');
});

db.close((err) => {
  if (err) {
    console.error('Ошибка при закрытии базы данных:', err);
  } else {
    console.log('Соединение с базой данных закрыто.');
  }
});
