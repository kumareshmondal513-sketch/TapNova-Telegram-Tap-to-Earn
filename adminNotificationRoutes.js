import express from 'express';

import {
  createAdminNotification,
  getAdminNotifications,
  deleteAdminNotification
} from '../services/adminNotificationService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get('/', async (req, res, next) => {
  try {
    const notifications =
      await getAdminNotifications(
        req.query.limit
      );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const createdBy =
      req.user?.telegramId ??
      req.admin?.telegramId ??
      req.telegramId;

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message:
          'Admin identity is required.'
      });
    }

    const {
      title,
      message,
      type = 'info'
    } = req.body || {};

    const result =
      await createAdminNotification({
        title,
        message,
        type,
        createdBy
      });

    return res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Admin Telegram ID is required.',
      'Notification title is required.',
      'Notification message is required.',
      'Invalid notification type.'
    ];

    if (
      clientErrors.includes(error.message)
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
});

router.delete(
  '/:notificationId',
  async (req, res, next) => {
    try {
      const result =
        await deleteAdminNotification(
          req.params.notificationId
        );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error.message ===
          'Notification ID is required.' ||
        error.message ===
          'Notification not found.'
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return next(error);
    }
  }
);

export default router;