const TelegramBot = require('node-telegram-bot-api');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class TelegramBotService {
  constructor() {
    this.bot = null;
    this.adminChatId = process.env.ADMIN_CHAT_ID;
    
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.initializeBot();
    }
  }

  initializeBot() {
    try {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
      console.log('Telegram бот инициализирован');
    } catch (error) {
      console.error('Ошибка инициализации Telegram бота:', error);
    }
  }

  async sendSurveyResults(surveyData) {
    if (!this.bot || !this.adminChatId) {
      console.log('Telegram бот не настроен или отсутствует ADMIN_CHAT_ID');
      return;
    }

    try {
      // Создаем Excel файл
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Результаты опроса');

      // Настройка заголовков
      worksheet.columns = [
        { header: 'Имя пользователя', key: 'user_name', width: 20 },
        { header: 'Проект', key: 'project_name', width: 25 },
        { header: 'Вопрос', key: 'question_text', width: 50 },
        { header: 'Оценка', key: 'rating', width: 10 },
        { header: 'Комментарий', key: 'comment', width: 30 },
        { header: 'Общая оценка', key: 'total_score', width: 15 },
        { header: 'Дата завершения', key: 'completed_at', width: 20 }
      ];

      // Стили для заголовков
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Группируем данные по пользователям
      const groupedData = this.groupSurveyData(surveyData);

      let rowNumber = 2;
      for (const userData of groupedData) {
        // Добавляем строку с общей информацией о пользователе
        worksheet.addRow({
          user_name: userData.user_name,
          project_name: userData.project_name,
          question_text: 'ОБЩАЯ ИНФОРМАЦИЯ',
          rating: '',
          comment: '',
          total_score: userData.total_score,
          completed_at: userData.completed_at
        });

        // Выделяем строку с общей информацией
        worksheet.getRow(rowNumber).font = { bold: true };
        worksheet.getRow(rowNumber).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F8FF' }
        };
        rowNumber++;

        // Добавляем ответы на вопросы
        for (const response of userData.responses) {
          worksheet.addRow({
            user_name: '',
            project_name: '',
            question_text: response.question_text,
            rating: response.rating,
            comment: response.comment || '',
            total_score: '',
            completed_at: ''
          });
          rowNumber++;
        }

        // Добавляем пустую строку между пользователями
        worksheet.addRow({});
        rowNumber++;
      }

      // Сохраняем файл
      const fileName = `survey_results_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filePath = path.join(__dirname, 'temp', fileName);
      
      // Создаем папку temp если её нет
      if (!fs.existsSync(path.join(__dirname, 'temp'))) {
        fs.mkdirSync(path.join(__dirname, 'temp'));
      }

      await workbook.xlsx.writeFile(filePath);

      // Отправляем файл в Telegram
      await this.bot.sendDocument(this.adminChatId, filePath, {
        caption: `📊 Результаты опроса системных аналитиков\n\n📅 Дата: ${new Date().toLocaleDateString('ru-RU')}\n👥 Количество участников: ${groupedData.length}\n\nФайл содержит детальные результаты опроса с оценками и комментариями.`
      });

      // Удаляем временный файл
      fs.unlinkSync(filePath);

      console.log('Результаты опроса отправлены в Telegram');
    } catch (error) {
      console.error('Ошибка отправки результатов в Telegram:', error);
    }
  }

  groupSurveyData(surveyData) {
    const grouped = {};
    
    surveyData.forEach(item => {
      const key = `${item.user_name}_${item.project_name}_${item.completed_at}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          user_name: item.user_name,
          project_name: item.project_name,
          total_score: item.total_score,
          completed_at: item.completed_at,
          responses: []
        };
      }
      
      grouped[key].responses.push({
        question_text: item.question_text,
        rating: item.rating,
        comment: item.comment
      });
    });

    return Object.values(grouped);
  }

  async sendNotification(message) {
    if (!this.bot || !this.adminChatId) {
      console.log('Telegram бот не настроен');
      return;
    }

    try {
      await this.bot.sendMessage(this.adminChatId, message);
    } catch (error) {
      console.error('Ошибка отправки уведомления в Telegram:', error);
    }
  }
}

module.exports = new TelegramBotService();
