import {
  createBroadcast,
  getBroadcastRecipients,
  updateBroadcastStatus
} from '../services/adminBroadcastService.js';

function getAdminTelegramId(req) {
  return (
    req.user?.telegramId ??
    req.admin?.telegramId ??
    req.telegramId ??
    null
  );
}

export async function createBroadcastController(
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
        message: 'Admin identity is required.'
      });
    }

    const result = await createBroadcast({
      title: req.body?.title,
      message: req.body?.message,
      createdBy
    });

    return res.status(201).json(result);
  } catch (error) {
    const clientErrors = [
      'Admin Telegram ID is required.',
      'Broadcast title is required.',
      'Broadcast message is required.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}

export async function getBroadcastRecipientsController(
  req,
  res,
  next
) {
  try {
    const recipients =
      await getBroadcastRecipients();

    return res.status(200).json({
      success: true,
      count: recipients.length,
      recipients
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateBroadcastStatusController(
  req,
  res,
  next
) {
  try {
    const updatedBy =
      getAdminTelegramId(req);

    if (!updatedBy) {
      return res.status(401).json({
        success: false,
        message: 'Admin identity is required.'
      });
    }

    const result =
      await updateBroadcastStatus(
        req.params.broadcastId,
        req.body?.status,
        updatedBy
      );

    return res.status(200).json(result);
  } catch (error) {
    const clientErrors = [
      'Broadcast ID is required.',
      'Admin Telegram ID is required.',
      'Invalid broadcast status.',
      'Broadcast not found.'
    ];

    if (clientErrors.includes(error.message)) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next(error);
  }
}