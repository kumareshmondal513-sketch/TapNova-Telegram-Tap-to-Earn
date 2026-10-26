import express from 'express';

import {
  recordAdminActivity,
  getAdminActivities,
  clearAdminActivities
} from '../services/adminActivityService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get('/', async (req, res, next) => {
  try {
    const activities = await getAdminActivities({
      limit: req.query.limit,
      adminTelegramId:
        req.query.adminTelegramId || null
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
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

    const {
      activity,
      targetTelegramId = null,
      metadata = null
    } = req.body || {};

    const result = await recordAdminActivity({
      adminTelegramId,
      activity,
      targetTelegramId,
      metadata
    });

    return res.status(201).json(result);
  } catch (error) {
    if (
      error.message ===
        'Admin Telegram ID is required.' ||
      error.message ===
        'Admin activity is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
});

router.delete('/', async (req, res, next) => {
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
      await clearAdminActivities(
        adminTelegramId
      );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;