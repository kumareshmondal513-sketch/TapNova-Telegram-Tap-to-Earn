import express from 'express';
import {
  exportUsers,
  usersToCsv
} from '../services/adminUserExportService.js';
import {
  requireMainAdmin
} from '../middleware/adminRoleMiddleware.js';

const router = express.Router();

router.get(
  '/csv',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await exportUsers({
        limit: req.query.limit
      });

      const csv = usersToCsv(result.users);

      res.setHeader(
        'Content-Type',
        'text/csv; charset=utf-8'
      );

      res.setHeader(
        'Content-Disposition',
        'attachment; filename="tapnova-users.csv"'
      );

      return res.status(200).send(
        '\uFEFF' + csv
      );
    } catch (error) {
      console.error(
        'User CSV export failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to export users.'
      });
    }
  }
);

router.get(
  '/',
  requireMainAdmin,
  async (req, res) => {
    try {
      const result = await exportUsers({
        limit: req.query.limit
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(
        'User export failed:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to export users.'
      });
    }
  }
);

export default router;