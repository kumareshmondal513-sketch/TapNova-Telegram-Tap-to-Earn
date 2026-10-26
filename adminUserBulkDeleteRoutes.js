import express from 'express';
import {
  bulkDeleteUsersController
} from '../controllers/adminUserBulkDeleteController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';
import {
  validateBulkDeleteUsersMiddleware
} from '../middleware/adminUserBulkDeleteValidationMiddleware.js';

const router = express.Router();

router.delete(
  '/',
  requireMainAdmin,
  validateBulkDeleteUsersMiddleware,
  bulkDeleteUsersController
);

export default router;