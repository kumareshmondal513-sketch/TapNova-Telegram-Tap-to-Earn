import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    app: 'TapNova',
    status: 'online'
  });
});

export default router;