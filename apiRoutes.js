import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'TapNova API',
    status: 'online'
  });
});

router.get('/version', (req, res) => {
  res.json({
    success: true,
    app: 'TapNova',
    version: '1.0.0'
  });
});

export default router;