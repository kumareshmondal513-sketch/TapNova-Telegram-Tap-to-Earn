import express from 'express';

import {
  getNotificationsController,
  createNotificationController,
  deleteNotificationController
} from '../controllers/adminNotificationController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.use(requireMainAdmin());

router.get(
  '/',
  getNotificationsController
);

router.post(
  '/',
  createNotificationController
);

router.delete(
  '/:notificationId',
  deleteNotificationController
);

export default router;