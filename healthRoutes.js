import express from 'express';

import {
  getHealthStatus
} from '../services/healthService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const health = await getHealthStatus();

    const statusCode =
      health.status === 'ok'
        ? 200
        : 503;

    res.status(statusCode).json({
      success: health.status === 'ok',
      ...health
    });
  } catch (error) {
    next(error);
  }
});

export default router;