import express from 'express';
import {
  updateUserStatus
} from '../controllers/adminUserStatusController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.patch(
  '/:telegramId/status',
  requireMainAdmin,
  updateUserStatus
);

export default router;