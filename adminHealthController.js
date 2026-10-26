import db from '../firebase.js';

export async function getAdminHealthController(
  req,
  res,
  next
) {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        firebase: 'not_initialized',
        timestamp: Date.now()
      });
    }

    await db.ref('.info/connected').once('value');

    return res.status(200).json({
      success: true,
      status: 'healthy',
      firebase: 'initialized',
      timestamp: Date.now()
    });
  } catch (error) {
    return next(error);
  }
}