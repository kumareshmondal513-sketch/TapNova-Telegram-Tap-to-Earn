import express from 'express';
import {
  listUserNotes,
  createUserNote
} from '../controllers/adminUserNotesController.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/notes',
  requireMainAdmin,
  listUserNotes
);

router.post(
  '/:telegramId/notes',
  requireMainAdmin,
  createUserNote
);

export default router;