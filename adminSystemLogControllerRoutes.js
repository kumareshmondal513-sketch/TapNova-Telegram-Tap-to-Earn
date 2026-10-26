import express from 'express';

import {
  getSystemLogsController,
  createSystemLogController,
  getSystemLogLevelsController
} from '../controllers/adminSystemLogController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/levels',
  getSystemLogLevelsController
);

router.get(
  '/',
  getSystemLogsController
);

router.post(
  '/',
  createSystemLogController
);

export default router;