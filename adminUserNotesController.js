import {
  addAdminUserNote,
  getAdminUserNotes
} from '../services/adminUserNotesService.js';

export async function listUserNotes(req, res) {
  try {
    const result = await getAdminUserNotes({
      telegramId: req.params.telegramId,
      limit: req.query.limit
    });

    return res.status(200).json(result);
  } catch (error) {
    const message = error.message || '';
    const statusCode = message.includes('required')
      ? 400
      : 500;

    if (statusCode === 500) {
      console.error('List user notes failed:', error);
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? 'Failed to retrieve user notes.'
          : message
    });
  }
}

export async function createUserNote(req, res) {
  try {
    const adminId =
      req.admin?.telegramId ??
      req.admin?.id ??
      req.user?.telegramId ??
      req.user?.id;

    const result = await addAdminUserNote({
      telegramId: req.params.telegramId,
      note: req.body?.note,
      adminId
    });

    return res.status(201).json(result);
  } catch (error) {
    const message = error.message || '';

    const statusCode =
      message.includes('required') ||
      message.includes('cannot exceed')
        ? 400
        : 500;

    if (statusCode === 500) {
      console.error('Create user note failed:', error);
    }

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? 'Failed to save user note.'
          : message
    });
  }
}