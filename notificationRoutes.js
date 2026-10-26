import express from 'express';
import {
  getNotifications,
  markNotificationRead
} from '../services/notificationService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res, next) => {
  try {
    const notifications = await getNotifications(
      req.params.telegramId,
      req.query.limit || 20
    );

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    if (error.message === 'Telegram ID is required.') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.patch('/:telegramId/:notificationId/read', async (req, res, next) => {
  try {
    const result = await markNotificationRead(
      req.params.telegramId,
      req.params.notificationId
    );

    res.json(result);
  } catch (error) {
    if (
      error.message === 'Telegram ID and notification ID are required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Notification not found.') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;