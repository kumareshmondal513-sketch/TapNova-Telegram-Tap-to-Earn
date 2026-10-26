import express from 'express';
import { getLeaderboard } from '../services/leaderboardService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit || 20;
    const leaderboard = await getLeaderboard(limit);

    res.json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
});

export default router;