import {
  getAdminUserActivity
} from '../services/adminUserActivityService.js';

export async function getUserActivity(req, res) {
  try {
    const result = await getAdminUserActivity({
      telegramId: req.params.telegramId
    });

    return res.status(200).json(result);
  } catch (error) {
    const message = error.message || '';

    const statusCode =
      message === 'User not found.'
        ? 404
        : message.includes('required')
          ? 400
          : 500;

    if (statusCode === 500) {
      console.error(
        'User activity controller failed:',
        error
      );
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? 'Failed to retrieve user activity.'
          : message
    });
  }
}