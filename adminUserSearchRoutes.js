import express from 'express';
import {
  searchAdminUsers
} from '../services/adminUserSearchService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await searchAdminUsers({
        query: req.query.q,
        limit: req.query.limit
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        'Admin user search failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to search users.'
      });
    }
  }
);

export default router;