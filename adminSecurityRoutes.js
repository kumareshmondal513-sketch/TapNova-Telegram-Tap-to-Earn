import express from 'express';

import {
  getAdminSecuritySettings,
  updateAdminSecuritySettings,
  getSecurityEvents
} from '../services/adminSecurityService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get('/settings', async (req, res, next) => {
  try {
    const settings =
      await getAdminSecuritySettings();

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    return next(error);
  }
});

router.patch('/settings', async (req, res, next) => {
  try {
    const adminTelegramId =
      req.user?.telegramId ??
      req.admin?.telegramId ??
      req.telegramId;

    if (!adminTelegramId) {
      return res.status(401).json({
        success: false,
        message: 'Admin identity is required.'
      });
    }

    const result =
      await updateAdminSecuritySettings({
        settings: req.body,
        adminTelegramId
      });

    return res.status(200).json(result);
  } catch (error) {
    const messages = [
      'Admin Telegram ID is required.',
      'Valid security settings are required.',
      'No valid security settings were provided.',
      'Max failed attempts must be between 1 and 20.',
      'Lockout minutes must be between 1 and 1440.',
      'Session timeout must be between 5 and 1440 minutes.'
    ];

    if (messages.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
});

router.get('/events', async (req, res, next) => {
  try {
    const events =
      await getSecurityEvents(req.query.limit);

    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    return next(error);
  }
});

export default router;