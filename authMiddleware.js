import { verifyTelegramInitData } from '../services/securityService.js';

export function telegramAuth(req, res, next) {
  try {
    const initData =
      req.headers['x-telegram-init-data'];

    const botToken =
      process.env.BOT_TOKEN ||
      process.env.TELEGRAM_BOT_TOKEN;

    if (!initData) {
      return res.status(401).json({
        success: false,
        message: 'Telegram authentication data is required.'
      });
    }

    if (!botToken) {
      return res.status(500).json({
        success: false,
        message: 'Telegram bot token is not configured.'
      });
    }

    const result = verifyTelegramInitData(
      initData,
      botToken
    );

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: result.reason
      });
    }

    req.telegramUser = result.user;
    req.telegramUserId = String(
      result.user?.id || ''
    );

    if (!req.telegramUserId) {
      return res.status(401).json({
        success: false,
        message: 'Telegram user ID is missing.'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function requireTelegramUser(
  req,
  res,
  next
) {
  if (!req.telegramUserId) {
    return res.status(401).json({
      success: false,
      message: 'Telegram user is not authenticated.'
    });
  }

  next();
}