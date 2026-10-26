import express from 'express';
import {
  regenerateEnergy,
  setEnergy
} from '../services/energyService.js';

const router = express.Router();

router.post('/regenerate', async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'telegramId is required.'
      });
    }

    const user = await regenerateEnergy(telegramId);

    return res.json({
      success: true,
      energy: user.energy,
      maxEnergy: user.maxEnergy
    });
  } catch (error) {
    console.error('Energy regeneration error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Energy update failed.'
    });
  }
});

router.post('/set', async (req, res) => {
  try {
    const { telegramId, energy } = req.body;

    if (!telegramId || energy === undefined) {
      return res.status(400).json({
        success: false,
        message: 'telegramId and energy are required.'
      });
    }

    const user = await setEnergy(telegramId, energy);

    return res.json({
      success: true,
      energy: user.energy,
      maxEnergy: user.maxEnergy
    });
  } catch (error) {
    console.error('Set energy error:', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Energy update failed.'
    });
  }
});

export default router;