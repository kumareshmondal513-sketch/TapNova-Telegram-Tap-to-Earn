import express from 'express';

import {
  markUserActive,
  markUserInactive,
  getActiveUserCount,
  getActiveUsers
} from '../services/activeUserService.js';

const router = express.Router();

router.post('/active', async (req, res, next) => {
  try {
    const { telegramId } = req.body;

    const result = await markUserActive(
      telegramId
    );

    res.json(result);
  } catch (error) {
    if (
      error.message ===
      'Telegram ID is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.post('/inactive', async (req, res, next) => {
  try {
    const { telegramId } = req.body;

    const result = await markUserInactive(
      telegramId
    );

    res.json(result);
  } catch (error) {
    if (
      error.message ===
      'Telegram ID is required.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.get('/count', async (req, res, next) => {
  try {
    const activeWithinMs =
      Number(req.query.activeWithinMs) ||
      5 * 60 * 1000;

    const count =
      await getActiveUserCount(
        activeWithinMs
      );

    res.json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const activeWithinMs =
      Number(req.query.activeWithinMs) ||
      5 * 60 * 1000;

    const users =
      await getActiveUsers(
        activeWithinMs
      );

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
});

export default router;