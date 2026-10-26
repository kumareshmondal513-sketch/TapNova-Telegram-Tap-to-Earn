import TelegramBot from 'node-telegram-bot-api';
import config from './config.js';

let bot = null;

if (config.telegram.botToken) {
  bot = new TelegramBot(config.telegram.botToken, {
    polling: true
  });

  bot.onText(/^\/start(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const startParameter = match?.[1] || '';

    await bot.sendMessage(
      chatId,
      [
        '🎉 Welcome to TapNova!',
        '',
        '🚀 Telegram Tap-to-Earn Mini App',
        '',
        `Referral parameter: ${startParameter || 'none'}`,
        '',
        'Mini App will be connected here later.'
      ].join('\n')
    );
  });

  bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
  });

  console.log('Telegram bot initialized.');
} else {
  console.warn('TELEGRAM_BOT_TOKEN is not configured.');
}

export { bot };

export default bot;