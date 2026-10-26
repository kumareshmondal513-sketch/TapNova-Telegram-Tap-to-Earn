import express from 'express';

import {
  getAdminDashboardSummary,
  getAdminDashboardHealth
} from '../services/adminDashboardService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/summary',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const summary =
        await getAdminDashboardSummary();

      return res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/health',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const health =
        await getAdminDashboardHealth();

      return res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  }
);

export default router;