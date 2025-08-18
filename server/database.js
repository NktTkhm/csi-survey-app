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

  // Инициализация базы данных
  async init() {
    try {
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          is_admin INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          project_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (project_id) REFERENCES projects (id),
          UNIQUE(user_id, project_id)
        );

        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          order_num INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS survey_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          project_id INTEGER NOT NULL,
          total_score REAL,
          completed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (project_id) REFERENCES projects (id)
        );

        CREATE TABLE IF NOT EXISTS survey_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id INTEGER NOT NULL,
          question_id INTEGER NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES survey_sessions (id),
          FOREIGN KEY (question_id) REFERENCES questions (id)
        );
      `);

      // Проверяем и мигрируем структуру survey_responses если нужно
      await this.migrateSurveyResponsesTable();

      // Добавляем тестовые данные, если база пустая
      await this.addTestData();

      console.log('✅ База данных инициализирована');
    } catch (error) {
      console.error('❌ Ошибка инициализации базы данных:', error);
      throw error;
    }
  }

  // Миграция таблицы survey_responses
  async migrateSurveyResponsesTable() {
    try {
      // Проверяем, есть ли колонка session_id
      const tableInfo = await this.db.all("PRAGMA table_info(survey_responses)");
      const hasSessionId = tableInfo.some(col => col.name === 'session_id');
      
      if (!hasSessionId) {
        console.log('🔄 Миграция таблицы survey_responses...');
        
        // Создаем новую таблицу с правильной структурой
        await this.db.exec(`
          CREATE TABLE survey_responses_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES survey_sessions (id),
            FOREIGN KEY (question_id) REFERENCES questions (id)
          )
        `);
        
        // Удаляем старую таблицу и переименовываем новую
        await this.db.exec(`
          DROP TABLE IF EXISTS survey_responses;
          ALTER TABLE survey_responses_new RENAME TO survey_responses;
        `);
        
        console.log('✅ Миграция survey_responses завершена');
      }
    } catch (error) {
      console.error('❌ Ошибка миграции survey_responses:', error);
      // Если миграция не удалась, пересоздаем таблицу
      try {
        console.log('🔄 Пересоздание таблицы survey_responses...');
        await this.db.exec(`
          DROP TABLE IF EXISTS survey_responses;
          CREATE TABLE survey_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES survey_sessions (id),
            FOREIGN KEY (question_id) REFERENCES questions (id)
          )
        `);
        console.log('✅ Таблица survey_responses пересоздана');
      } catch (recreateError) {
        console.error('❌ Ошибка пересоздания таблицы:', recreateError);
      }
    }
  }

  // Добавление тестовых данных
  async addTestData() {
    try {
      // Проверяем, есть ли уже данные
      const userCount = await this.db.get('SELECT COUNT(*) as count FROM users');
      if (userCount.count > 0) {
        console.log('📊 Данные уже существуют, пропускаем создание тестовых данных');
        return;
      }

      console.log('📝 Создание тестовых данных...');

      // Добавляем тестовых пользователей
      const testUsers = [
        { name: 'Тихомиров Никита', email: 'tikhomirov@example.com', is_admin: 1 },
        { name: 'Иванов Иван', email: 'ivanov@example.com', is_admin: 0 },
        { name: 'Петров Петр', email: 'petrov@example.com', is_admin: 0 },
        { name: 'Сидоров Сидор', email: 'sidorov@example.com', is_admin: 0 },
        { name: 'Козлов Козел', email: 'kozlov@example.com', is_admin: 0 },
        { name: 'Волков Волк', email: 'volkov@example.com', is_admin: 0 },
        { name: 'Медведев Медведь', email: 'medvedev@example.com', is_admin: 0 },
        { name: 'Лисицын Лис', email: 'lisitsyn@example.com', is_admin: 0 },
        { name: 'Зайцев Заяц', email: 'zaytsev@example.com', is_admin: 0 },
        { name: 'Белов Белый', email: 'belov@example.com', is_admin: 0 },
        { name: 'Чернов Черный', email: 'chernov@example.com', is_admin: 0 },
        { name: 'Краснов Красный', email: 'krasnov@example.com', is_admin: 0 },
        { name: 'Желтов Желтый', email: 'zheltov@example.com', is_admin: 0 },
        { name: 'Синьков Синий', email: 'sinkov@example.com', is_admin: 0 },
        { name: 'Зеленов Зеленый', email: 'zelenov@example.com', is_admin: 0 },
        { name: 'Оранжев Оранжевый', email: 'oranzhev@example.com', is_admin: 0 },
        { name: 'Фиолетов Фиолетовый', email: 'fioletov@example.com', is_admin: 0 },
        { name: 'Розов Розовый', email: 'rozov@example.com', is_admin: 0 },
        { name: 'Серый Серый', email: 'sery@example.com', is_admin: 0 },
        { name: 'Коричнев Коричневый', email: 'korichnev@example.com', is_admin: 0 },
        { name: 'Голубов Голубой', email: 'golubov@example.com', is_admin: 0 }
      ];

      for (const user of testUsers) {
        await this.db.run(
          'INSERT INTO users (name, email, is_admin) VALUES (?, ?, ?)',
          [user.name, user.email, user.is_admin]
        );
      }

      // Добавляем тестовые проекты
      const testProjects = [
        { name: 'Проект А', description: 'Описание проекта А' },
        { name: 'Проект Б', description: 'Описание проекта Б' },
        { name: 'Проект В', description: 'Описание проекта В' },
        { name: 'Проект Г', description: 'Описание проекта Г' },
        { name: 'Проект Д', description: 'Описание проекта Д' }
      ];

      for (const project of testProjects) {
        await this.db.run(
          'INSERT INTO projects (name, description) VALUES (?, ?)',
          [project.name, project.description]
        );
      }

      // Добавляем правильные вопросы из файла question.txt
      const questions = [
        'Насколько системный аналитик помогает команде избежать недопонимания и ошибок при разработке функциональности?',
        'Насколько удобно вам взаимодействовать с системным аналитиком вашего проекта?',
        'Насколько, на ваш взгляд, системный аналитик способствует эффективному командному взаимодействию?',
        'Насколько, на ваш взгляд, системный аналитик понятно и полно формулирует требования?',
        'Насколько, на ваш взгляд, системный аналитик эффективно передает требования между различными ролями (разработчики, тестировщики, менеджеры)?',
        'Насколько, на ваш взгляд, системный аналитик открыт к обсуждению и разъяснению требований?',
        'Насколько глубоко системный аналитик понимает специфику проекта и его бизнес-цели?',
        'Насколько быстро системный аналитик реагирует на изменения в проекте?',
        'Насколько качественно подготовлена документация на проекте (описание функциональности, логика работы, спецификации и т. д.)?',
        'Насколько работа системного аналитика способствует своевременной реализации проекта?',
        'Насколько, на ваш взгляд, системный аналитик вовлечен в работу над проектом?',
        'Насколько работа системного аналитика снижает неопределенность и риски в проекте?',
        'Оцените в целом выполнение функций системного анализа на проекте?'
      ];

      for (let i = 0; i < questions.length; i++) {
        await this.db.run(
          'INSERT INTO questions (text, order_num) VALUES (?, ?)',
          [questions[i], i + 1]
        );
      }

      // Назначаем некоторых пользователей на проекты
      const assignments = [
        { userId: 1, projectId: 1 },
        { userId: 1, projectId: 2 },
        { userId: 2, projectId: 1 },
        { userId: 3, projectId: 2 },
        { userId: 4, projectId: 3 },
        { userId: 5, projectId: 4 },
        { userId: 6, projectId: 5 },
        { userId: 7, projectId: 1 },
        { userId: 8, projectId: 2 },
        { userId: 9, projectId: 3 },
        { userId: 10, projectId: 4 },
        { userId: 11, projectId: 5 },
        { userId: 12, projectId: 1 },
        { userId: 13, projectId: 2 },
        { userId: 14, projectId: 3 },
        { userId: 15, projectId: 4 },
        { userId: 16, projectId: 5 },
        { userId: 17, projectId: 1 },
        { userId: 18, projectId: 2 },
        { userId: 19, projectId: 3 },
        { userId: 20, projectId: 4 },
        { userId: 21, projectId: 5 }
      ];

      for (const assignment of assignments) {
        try {
          await this.db.run(
            'INSERT INTO user_projects (user_id, project_id) VALUES (?, ?)',
            [assignment.userId, assignment.projectId]
          );
        } catch (error) {
          // Игнорируем дубликаты
        }
      }

      console.log('✅ Тестовые данные созданы');
    } catch (error) {
      console.error('❌ Ошибка создания тестовых данных:', error);
    }
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
      this.db.all('SELECT * FROM questions ORDER BY order_num', (err, rows) => {
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
        'UPDATE survey_sessions SET total_score = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
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
        'INSERT INTO survey_responses (session_id, question_id, rating, comment) VALUES (?, ?, ?, ?)',
        [sessionId, questionId, rating, comment],
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
      // Сначала проверяем структуру таблицы
      this.db.all("PRAGMA table_info(survey_responses)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }
        
        const hasSessionId = columns.some(col => col.name === 'session_id');
        
        if (hasSessionId) {
          // Новая структура
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
            INNER JOIN survey_sessions ss ON sr.session_id = ss.id
            INNER JOIN users u ON ss.user_id = u.id
            INNER JOIN projects p ON ss.project_id = p.id
            INNER JOIN questions q ON sr.question_id = q.id
            WHERE ss.completed_at IS NOT NULL
            ORDER BY ss.completed_at DESC, u.name, q.order_num
          `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        } else {
          // Старая структура (если есть)
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
            WHERE ss.completed_at IS NOT NULL
            ORDER BY ss.completed_at DESC, u.name, q.order_num
          `, (err, rows) => {
            if (err) {
              // Если и старая структура не работает, возвращаем пустой массив
              console.log('⚠️ Не удалось получить результаты, возвращаем пустой массив');
              resolve([]);
            } else {
              resolve(rows);
            }
          });
        }
      });
    });
  }

  async getSurveyResultsByUser(userId) {
    return new Promise((resolve, reject) => {
      // Сначала проверяем структуру таблицы
      this.db.all("PRAGMA table_info(survey_responses)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }
        
        const hasSessionId = columns.some(col => col.name === 'session_id');
        
        if (hasSessionId) {
          // Новая структура
          this.db.all(`
            SELECT 
              p.name as project_name,
              q.text as question_text,
              sr.rating,
              sr.comment,
              ss.total_score,
              ss.completed_at
            FROM survey_responses sr
            INNER JOIN survey_sessions ss ON sr.session_id = ss.id
            INNER JOIN projects p ON ss.project_id = p.id
            INNER JOIN questions q ON sr.question_id = q.id
            WHERE ss.user_id = ? AND ss.completed_at IS NOT NULL
            ORDER BY ss.completed_at DESC, q.order_num
          `, [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        } else {
          // Старая структура (если есть)
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
            WHERE sr.user_id = ? AND ss.completed_at IS NOT NULL
            ORDER BY ss.completed_at DESC, q.order_num
          `, [userId], (err, rows) => {
            if (err) {
              // Если и старая структура не работает, возвращаем пустой массив
              console.log('⚠️ Не удалось получить результаты пользователя, возвращаем пустой массив');
              resolve([]);
            } else {
              resolve(rows);
            }
          });
        }
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
