import express from 'express';
import {
  getUserActivity
} from '../controllers/adminUserActivityController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/activity',
  requireMainAdmin,
  getUserActivity
);

export default router;