import express from 'express';
import {
  updateBulkUserStatus
} from '../controllers/adminUserBulkController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.patch(
  '/status',
  requireMainAdmin,
  updateBulkUserStatus
);

export default router;