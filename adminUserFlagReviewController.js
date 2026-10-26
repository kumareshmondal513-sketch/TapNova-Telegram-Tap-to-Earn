import {
  reviewAdminUserFlag
} from '../services/adminUserFlagReviewService.js';

export async function reviewUserFlag(req, res) {
  try {
    const adminId =
      req.admin?.telegramId ??
      req.admin?.id ??
      req.user?.telegramId ??
      req.user?.id;

    const result = await reviewAdminUserFlag({
      telegramId: req.params.telegramId,
      flagId: req.params.flagId,
      status: req.body?.status,
      adminId,
      reviewNote: req.body?.reviewNote
    });

    return res.status(200).json(result);
  } catch (error) {
    const message = error.message || '';

    const statusCode =
      message === 'User flag not found.'
        ? 404
        : message.includes('required') ||
            message.includes('must be') ||
            message.includes('cannot exceed')
          ? 400
          : 500;

    if (statusCode === 500) {
      console.error('Review user flag failed:', error);
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? 'Failed to review user flag.'
          : message
    });
  }
}