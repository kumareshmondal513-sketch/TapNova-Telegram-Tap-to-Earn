import express from 'express';

import {
  getRolesController,
  setRoleController,
  removeRoleController,
  getValidRolesController
} from '../controllers/adminRoleController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/valid-roles',
  getValidRolesController
);

router.get(
  '/:telegramId',
  getRolesController
);

router.post(
  '/',
  setRoleController
);

router.delete(
  '/:telegramId',
  removeRoleController
);

export default router;