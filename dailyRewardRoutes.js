import express from 'express';
import {
  claimDailyReward,
  getDailyRewardStatus
} from '../services/dailyRewardService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res, next) => {
  try {
    const status = await getDailyRewardStatus(
      req.params.telegramId
    );

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
});

router.post('/claim', async (req, res, next) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const result = await claimDailyReward(telegramId);

    res.json(result);
  } catch (error) {
    if (
      error.message === 'Daily reward already claimed today.'
    ) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message === 'User not found.' ||
      error.message === 'User account is not active.'
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