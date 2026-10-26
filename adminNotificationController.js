import {
  createAdminNotification,
  getAdminNotifications,
  deleteAdminNotification
} from '../services/adminNotificationService.js';

function getAdminTelegramId(req) {
  return (
    req.user?.telegramId ??
    req.admin?.telegramId ??
    req.telegramId ??
    null
  );
}

export async function getNotificationsController(
  req,
  res,
  next
) {
  try {
    const notifications =
      await getAdminNotifications(
        req.query.limit
      );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    return next(error);
  }
}

export async function createNotificationController(
  req,
  res,
  next
) {
  try {
    const createdBy =
      getAdminTelegramId(req);

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message:
          'Admin identity is required.'
      });
    }

    const {
      title,
      message,
      type = 'info'
    } = req.body || {};

    const result =
      await createAdminNotification({
        title,
        message,
        type,
        createdBy
      });

    return res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Admin Telegram ID is required.',
      'Notification title is required.',
      'Notification message is required.',
      'Invalid notification type.'
    ];

    if (
      clientErrors.includes(error.message)
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}

export async function deleteNotificationController(
  req,
  res,
  next
) {
  try {
    const result =
      await deleteAdminNotification(
        req.params.notificationId
      );

    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
        'Notification ID is required.' ||
      error.message ===
        'Notification not found.'
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}