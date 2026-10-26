import express from 'express';

import {
  getSecurityController,
  updateSecurityController,
  resetSecurityController
} from '../controllers/adminSecurityController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/',
  getSecurityController
);

router.patch(
  '/',
  updateSecurityController
);

router.post(
  '/reset',
  resetSecurityController
);

export default router;