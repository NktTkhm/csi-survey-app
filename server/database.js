const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database.sqlite';

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Ошибка подключения к базе данных:', err);
      } else {
        console.log('Подключение к базе данных SQLite установлено');
      }
    });
  }

  // Пользователи
  async getUsers() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      const { name, email, is_admin = 0 } = userData;
      this.db.run(
        'INSERT INTO users (name, email, is_admin) VALUES (?, ?, ?)',
        [name, email, is_admin],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...userData });
        }
      );
    });
  }

  async updateUser(id, userData) {
    return new Promise((resolve, reject) => {
      const { name, email, is_active, is_admin } = userData;
      this.db.run(
        'UPDATE users SET name = ?, email = ?, is_active = ?, is_admin = ? WHERE id = ?',
        [name, email, is_active, is_admin, id],
        function(err) {
          if (err) reject(err);
          else resolve({ id, ...userData });
        }
      );
    });
  }

  // Проекты
  async getProjects() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM projects ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async createProject(projectData) {
    return new Promise((resolve, reject) => {
      const { name, description } = projectData;
      this.db.run(
        'INSERT INTO projects (name, description) VALUES (?, ?)',
        [name, description],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...projectData });
        }
      );
    });
  }

  // Вопросы
  async getQuestions() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM questions WHERE is_active = 1 ORDER BY order_num', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Доступ пользователей к проектам
  async getUserProjects(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT p.* FROM projects p
        INNER JOIN user_projects up ON p.id = up.project_id
        WHERE up.user_id = ? AND p.is_active = 1
        ORDER BY p.name
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async assignUserToProject(userId, projectId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT OR IGNORE INTO user_projects (user_id, project_id) VALUES (?, ?)',
        [userId, projectId],
        function(err) {
          if (err) reject(err);
          else resolve({ userId, projectId });
        }
      );
    });
  }

  async removeUserFromProject(userId, projectId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM user_projects WHERE user_id = ? AND project_id = ?',
        [userId, projectId],
        function(err) {
          if (err) reject(err);
          else resolve({ userId, projectId });
        }
      );
    });
  }

  // Сессии опросов
  async createSurveySession(userId, projectId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO survey_sessions (user_id, project_id) VALUES (?, ?)',
        [userId, projectId],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, userId, projectId });
        }
      );
    });
  }

  async completeSurveySession(sessionId, totalScore) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE survey_sessions SET completed = 1, total_score = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [totalScore, sessionId],
        function(err) {
          if (err) reject(err);
          else resolve({ sessionId, totalScore });
        }
      );
    });
  }

  // Ответы на опросы
  async saveSurveyResponse(sessionId, questionId, rating, comment = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO survey_responses (user_id, project_id, question_id, rating, comment) SELECT user_id, project_id, ?, ?, ? FROM survey_sessions WHERE id = ?',
        [questionId, rating, comment, sessionId],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, questionId, rating, comment });
        }
      );
    });
  }

  // Получение результатов опросов
  async getSurveyResults() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          u.name as user_name,
          p.name as project_name,
          q.text as question_text,
          sr.rating,
          sr.comment,
          ss.total_score,
          ss.completed_at
        FROM survey_responses sr
        INNER JOIN users u ON sr.user_id = u.id
        INNER JOIN projects p ON sr.project_id = p.id
        INNER JOIN questions q ON sr.question_id = q.id
        INNER JOIN survey_sessions ss ON sr.user_id = ss.user_id AND sr.project_id = ss.project_id
        WHERE ss.completed = 1
        ORDER BY ss.completed_at DESC, u.name, q.order_num
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getSurveyResultsByUser(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          p.name as project_name,
          q.text as question_text,
          sr.rating,
          sr.comment,
          ss.total_score,
          ss.completed_at
        FROM survey_responses sr
        INNER JOIN projects p ON sr.project_id = p.id
        INNER JOIN questions q ON sr.question_id = q.id
        INNER JOIN survey_sessions ss ON sr.user_id = ss.user_id AND sr.project_id = ss.project_id
        WHERE sr.user_id = ? AND ss.completed = 1
        ORDER BY ss.completed_at DESC, q.order_num
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Ошибка при закрытии базы данных:', err);
      } else {
        console.log('Соединение с базой данных закрыто.');
      }
    });
  }
}

module.exports = new Database();
