import express from 'express';

import {
  getAdminHealthController
} from '../controllers/adminHealthController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  getAdminHealthController
);

export default router;