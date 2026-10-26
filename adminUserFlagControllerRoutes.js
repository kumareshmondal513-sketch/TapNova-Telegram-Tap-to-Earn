import express from 'express';
import {
  listUserFlags,
  createUserFlag
} from '../controllers/adminUserFlagController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/flags',
  requireMainAdmin,
  listUserFlags
);

router.post(
  '/:telegramId/flags',
  requireMainAdmin,
  createUserFlag
);

export default router;