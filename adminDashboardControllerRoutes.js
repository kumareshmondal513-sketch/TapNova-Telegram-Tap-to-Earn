import express from 'express';

import {
  getDashboardController,
  getWithdrawalSummaryController,
  getTaskSummaryController
} from '../controllers/adminDashboardController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/',
  getDashboardController
);

router.get(
  '/withdrawals',
  getWithdrawalSummaryController
);

router.get(
  '/tasks',
  getTaskSummaryController
);

export default router;