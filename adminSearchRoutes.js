import express from 'express';

import {
  searchUsers
} from '../services/adminSearchService.js';

import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/users',
  requireMainAdmin(),
  async (req, res, next) => {
    try {
      const users = await searchUsers({
        search: req.query.search,
        limit: req.query.limit
      });

      return res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      if (
        error.message ===
        'Search query is required.'
      ) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return next(error);
    }
  }
);

export default router;