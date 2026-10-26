import express from 'express';
import './bot.js';

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    success: true,
    app: 'TapNova',
    version: '1.0.0',
    message: 'TapNova API is working.'
  });
});

export default app;