// Скрипт для поддержания активности приложения на Render
// Запускайте этот скрипт на отдельном сервере или используйте внешние сервисы

const https = require('https');
const http = require('http');

const RENDER_URL = 'https://csi-survey-app.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 минут (чуть меньше 15 минут сна)

function pingServer() {
  const url = new URL(RENDER_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.get(url, (res) => {
    console.log(`✅ Пинг успешен: ${res.statusCode} - ${new Date().toISOString()}`);
  });
  
  req.on('error', (err) => {
    console.error(`❌ Ошибка пинга: ${err.message} - ${new Date().toISOString()}`);
  });
  
  req.setTimeout(30000, () => {
    console.log(`⏰ Таймаут пинга - ${new Date().toISOString()}`);
    req.destroy();
  });
}

// Запускаем пинг каждые 14 минут
console.log(`🚀 Запуск keep-alive для ${RENDER_URL}`);
console.log(`⏰ Интервал пинга: ${PING_INTERVAL / 1000 / 60} минут`);

pingServer(); // Первый пинг сразу
setInterval(pingServer, PING_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Остановка keep-alive...');
  process.exit(0);
});

