import express from 'express';

import {
  getAdminSettings,
  updateAdminSettings
} from '../services/adminSettingsService.js';

import { requireMainAdmin } from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

// সব অ্যাডমিন সেটিংস দেখুন
router.get('/', async (req, res, next) => {
  try {
    const settings = await getAdminSettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
});

// অ্যাডমিন সেটিংস পরিবর্তন করুন
router.patch('/', async (req, res, next) => {
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

    const result = await updateAdminSettings({
      settings: req.body,
      adminTelegramId
    });

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Admin Telegram ID is required.',
      'Valid settings object is required.',
      'No valid settings were provided.'
    ];

    if (
      clientErrors.includes(error.message) ||
      error.message.startsWith('Setting cannot be changed:') ||
      error.message.endsWith('must be true or false.') ||
      error.message === 'Language must be bn or en.' ||
      error.message ===
        'Minimum withdrawal coins must be a non-negative integer.' ||
      error.message ===
        'Task ad countdown must be between 0 and 60 seconds.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;