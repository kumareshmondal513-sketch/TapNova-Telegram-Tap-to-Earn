import express from 'express';
import {
  exportUsersJson,
  exportUsersCsv
} from '../controllers/adminUserExportController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/csv',
  requireMainAdmin,
  exportUsersCsv
);

router.get(
  '/',
  requireMainAdmin,
  exportUsersJson
);

export default router;