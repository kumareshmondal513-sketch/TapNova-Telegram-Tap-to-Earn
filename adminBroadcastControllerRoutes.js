import express from 'express';

import {
  createBroadcastController,
  getBroadcastRecipientsController,
  updateBroadcastStatusController
} from '../controllers/adminBroadcastController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.post(
  '/',
  createBroadcastController
);

router.get(
  '/recipients',
  getBroadcastRecipientsController
);

router.patch(
  '/:broadcastId/status',
  updateBroadcastStatusController
);

export default router;