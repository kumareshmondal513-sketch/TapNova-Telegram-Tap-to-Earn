import express from 'express';

import {
  setUserCountry,
  getUserCountry,
  getCountryStats
} from '../services/countryService.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const {
      telegramId,
      countryCode,
      countryName
    } = req.body;

    const result = await setUserCountry(
      telegramId,
      countryCode,
      countryName
    );

    res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Telegram ID is required.',
      'Country code is required.',
      'Country name is required.'
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

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getCountryStats();

    res.json({
      success: true,
      count: stats.length,
      countries: stats
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:telegramId', async (req, res, next) => {
  try {
    const country = await getUserCountry(
      req.params.telegramId
    );

    res.json({
      success: true,
      country
    });
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

export default router;