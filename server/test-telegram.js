const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

async function testTelegramBot() {
  console.log('🔍 Тестирование Telegram бота...');
  console.log('📋 Переменные окружения:');
  console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Установлен' : '❌ Отсутствует');
  console.log('ADMIN_CHAT_ID:', process.env.ADMIN_CHAT_ID ? '✅ Установлен' : '❌ Отсутствует');
  
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.ADMIN_CHAT_ID) {
    console.log('❌ Не все переменные окружения настроены');
    return;
  }

  try {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    
    console.log('🤖 Отправка тестового сообщения...');
    await bot.sendMessage(process.env.ADMIN_CHAT_ID, '🧪 Тестовое сообщение от CSI Survey App\n\nЕсли вы видите это сообщение, значит Telegram бот работает корректно!');
    
    console.log('✅ Тестовое сообщение отправлено успешно!');
  } catch (error) {
    console.error('❌ Ошибка при отправке тестового сообщения:', error.message);
  }
}

testTelegramBot();

