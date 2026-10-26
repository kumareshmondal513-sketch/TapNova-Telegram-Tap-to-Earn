import express from 'express';

import {
  getAdminAnalytics
} from '../services/adminAnalyticsService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const result =
        await getAdminAnalytics();

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;