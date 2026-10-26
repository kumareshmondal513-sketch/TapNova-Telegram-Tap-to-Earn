import express from 'express';
import {
  addAdminUserNote,
  getAdminUserNotes
} from '../services/adminUserNotesService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/:telegramId/notes',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await getAdminUserNotes({
        telegramId: req.params.telegramId,
        limit: req.query.limit
      });

      return res.status(200).json(result);
    } catch (error) {
      const message = error.message || '';
      const statusCode = message.includes('required')
        ? 400
        : 500;

      if (statusCode === 500) {
        console.error(
          'Get admin user notes failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to retrieve user notes.'
            : message
      });
    }
  }
);

router.post(
  '/:telegramId/notes',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await addAdminUserNote({
        telegramId: req.params.telegramId,
        note: req.body?.note,
        adminId: req.admin?.telegramId ??
          req.admin?.id ??
          req.user?.telegramId ??
          req.user?.id
      });

      return res.status(201).json(result);
    } catch (error) {
      const message = error.message || '';

      const statusCode =
        message.includes('required') ||
        message.includes('cannot exceed')
          ? 400
          : 500;

      if (statusCode === 500) {
        console.error(
          'Add admin user note failed:',
          error
        );
      }

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 500
            ? 'Failed to save user note.'
            : message
      });
    }
  }
);

export default router;