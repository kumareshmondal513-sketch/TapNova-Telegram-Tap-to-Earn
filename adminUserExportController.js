import {
  exportUsers,
  usersToCsv
} from '../services/adminUserExportService.js';

export async function exportUsersJson(req, res) {
  try {
    const result = await exportUsers({
      limit: req.query.limit
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('JSON user export failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to export users.'
    });
  }
}

export async function exportUsersCsv(req, res) {
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

    return res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    console.error('CSV user export failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to export users.'
    });
  }
}