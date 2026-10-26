import express from 'express';

import {
  createAdRewardClaim,
  completeAdRewardClaim,
  cancelAdRewardClaim
} from '../services/adRewardService.js';

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const {
      telegramId,
      adId,
      rewardId,
      multiplier
    } = req.body;

    const result = await createAdRewardClaim(
      telegramId,
      adId,
      rewardId,
      multiplier || 1
    );

    res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Telegram ID is required.',
      'Ad ID is required.',
      'Reward ID is required.',
      'User not found.',
      'Ad is not available.',
      'Reward multiplier must be 1 or 2.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.post('/complete', async (req, res, next) => {
  try {
    const {
      telegramId,
      claimId
    } = req.body;

    const result = await completeAdRewardClaim(
      telegramId,
      claimId
    );

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Telegram ID and claim ID are required.',
      'Ad reward claim not found.',
      'Invalid ad reward claim.',
      'Ad reward has already been claimed.',
      'Ad reward claim was cancelled.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

router.post('/cancel', async (req, res, next) => {
  try {
    const {
      telegramId,
      claimId
    } = req.body;

    const result = await cancelAdRewardClaim(
      telegramId,
      claimId
    );

    res.json(result);
  } catch (error) {
    const clientErrors = [
      'Telegram ID and claim ID are required.',
      'Ad reward claim not found.',
      'Invalid ad reward claim.',
      'Completed ad reward cannot be cancelled.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
});

export default router;