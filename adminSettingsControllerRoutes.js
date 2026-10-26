import express from 'express';

import {
  getSettingsController,
  updateSettingsController,
  getPublicFeatureSettingsController
} from '../controllers/adminSettingsController.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/public',
  getPublicFeatureSettingsController
);

router.get(
  '/',
  requireMainAdmin(),
  getSettingsController
);

router.patch(
  '/',
  requireMainAdmin(),
  updateSettingsController
);

export default router;