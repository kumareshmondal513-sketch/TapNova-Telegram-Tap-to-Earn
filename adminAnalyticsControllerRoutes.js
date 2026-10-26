import express from 'express';

import {
  getAdminAnalyticsController
} from '../controllers/adminAnalyticsController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  getAdminAnalyticsController
);

export default router;