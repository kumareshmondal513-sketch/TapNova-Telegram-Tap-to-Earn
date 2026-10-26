import express from 'express';

import {
  getUserController,
  updateUserController,
  deactivateUserController
} from '../controllers/adminUserController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/:telegramId',
  getUserController
);

router.patch(
  '/:telegramId',
  updateUserController
);

router.post(
  '/:telegramId/deactivate',
  deactivateUserController
);

export default router;