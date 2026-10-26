import express from 'express';
import {
  addXp,
  getLevelInfo
} from '../services/levelService.js';

const router = express.Router();

router.get('/:telegramId', async (req, res) => {
  try {
    const info = await getLevelInfo(req.params.telegramId);

    return res.json({
      success: true,
      ...info
    });
  } catch (error) {
    console.error('Get level error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to get level.'
    });
  }
});

router.post('/xp', async (req, res) => {
  try {
    const { telegramId, amount } = req.body;

    if (!telegramId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'telegramId and amount are required.'
      });
    }

    const user = await addXp(telegramId, amount);

    return res.json({
      success: true,
      level: user.level,
      xp: user.xp
    });
  } catch (error) {
    console.error('Add XP error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to add XP.'
    });
  }
});

export default router;