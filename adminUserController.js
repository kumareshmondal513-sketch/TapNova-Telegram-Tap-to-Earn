import db from '../firebase.js';

function getUsersRef() {
  if (!db) {
    throw new Error(
      'Firebase database is not configured.'
    );
  }

  return db.ref('users');
}

export async function getUserController(
  req,
  res,
  next
) {
  try {
    const telegramId =
      req.params.telegramId;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const snapshot =
      await getUsersRef()
        .child(String(telegramId))
        .once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: snapshot.key,
        ...snapshot.val()
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserController(
  req,
  res,
  next
) {
  try {
    const telegramId =
      req.params.telegramId;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const allowedFields = [
      'coins',
      'energy',
      'level',
      'xp',
      'active',
      'status',
      'country'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (
        Object.hasOwn(
          req.body || {},
          field
        )
      ) {
        updates[field] =
          req.body[field];
      }
    }

    updates.updatedAt = Date.now();

    const ref =
      getUsersRef()
        .child(String(telegramId));

    const snapshot =
      await ref.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await ref.update(updates);

    return res.status(200).json({
      success: true,
      telegramId: String(telegramId),
      updates
    });
  } catch (error) {
    return next(error);
  }
}

export async function deactivateUserController(
  req,
  res,
  next
) {
  try {
    const telegramId =
      req.params.telegramId;

    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Telegram ID is required.'
      });
    }

    const ref =
      getUsersRef()
        .child(String(telegramId));

    const snapshot =
      await ref.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await ref.update({
      active: false,
      status: 'disabled',
      updatedAt: Date.now()
    });

    return res.status(200).json({
      success: true,
      telegramId: String(telegramId),
      disabled: true
    });
  } catch (error) {
    return next(error);
  }
}