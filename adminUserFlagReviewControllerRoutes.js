import express from 'express';
import {
  reviewUserFlag
} from '../controllers/adminUserFlagReviewController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.patch(
  '/:telegramId/flags/:flagId/review',
  requireMainAdmin,
  reviewUserFlag
);

export default router;