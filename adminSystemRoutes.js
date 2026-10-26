import express from 'express';

import {
  getAdminSystemController
} from '../controllers/adminSystemController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  getAdminSystemController
);

export default router;