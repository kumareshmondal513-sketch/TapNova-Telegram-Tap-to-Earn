import {
  updateAdminUserStatus
} from '../services/adminUserStatusService.js';

export async function updateUserStatus(req, res) {
  try {
    const result = await updateAdminUserStatus({
      telegramId: req.params.telegramId,
      status: req.body?.status
    });

    return res.status(200).json(result);
  } catch (error) {
    const message = error.message || '';

    const statusCode =
      message === 'User not found.'
        ? 404
        : message.includes('required') ||
            message.includes('must be')
          ? 400
          : 500;

    if (statusCode === 500) {
      console.error(
        'User status controller failed:',
        error
      );
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? 'Failed to update user status.'
          : message
    });
  }
}