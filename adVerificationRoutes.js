import express from 'express';

import {
  startAdSession,
  completeAdSession
} from '../services/adVerificationService.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const {
      telegramId,
      adId
    } = req.body;

    if (!telegramId || !adId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId and adId are required.'
      });
    }

    const session = await startAdSession(
      telegramId,
      adId
    );

    return res.json({
      success: true,
      sessionId: session.id,
      duration: session.duration,
      startedAt: session.startedAt
    });
  } catch (error) {
    console.error('Start ad session error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to start ad.'
    });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const {
      telegramId,
      sessionId
    } = req.body;

    if (!telegramId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId and sessionId are required.'
      });
    }

    const session = await completeAdSession(
      telegramId,
      sessionId
    );

    return res.json({
      success: true,
      verified: true,
      sessionId: session.id,
      completedAt: session.completedAt
    });
  } catch (error) {
    console.error('Complete ad session error:', error);

    return res.status(400).json({
      success: false,
      verified: false,
      message: error.message || 'Ad verification failed.'
    });
  }
});

export default router;