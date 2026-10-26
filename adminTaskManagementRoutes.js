import express from 'express';

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from '../services/adminTaskManagementService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const includeDisabled =
        req.query.includeDisabled !== 'false';

      const tasks = await getTasks({
        includeDisabled,
        limit: req.query.limit
      });

      return res.status(200).json({
        success: true,
        count: tasks.length,
        tasks
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const createdBy =
        req.user?.telegramId ??
        req.telegramId;

      if (!createdBy) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required.'
        });
      }

      const result = await createTask(
        req.body,
        createdBy
      );

      return res.status(201).json(result);
    } catch (error) {
      if (
        error.message.includes('required') ||
        error.message.includes('Invalid') ||
        error.message.includes('must be') ||
        error.message.includes('Only HTTP')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
);

router.patch(
  '/:taskId',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const updatedBy =
        req.user?.telegramId ??
        req.telegramId;

      if (!updatedBy) {
        return res.status(401).json({
          success: false,
          message: 'Admin authentication required.'
        });
      }

      const result = await updateTask(
        req.params.taskId,
        req.body,
        updatedBy
      );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error.message.includes('required') ||
        error.message.includes('Invalid') ||
        error.message.includes('not found') ||
        error.message.includes('must be') ||
        error.message.includes('Only HTTP')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
);

router.delete(
  '/:taskId',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const result = await deleteTask(
        req.params.taskId
      );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error.message.includes('required') ||
        error.message.includes('not found')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
);

export default router;