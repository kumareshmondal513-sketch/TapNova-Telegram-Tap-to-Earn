import express from 'express';
import config from './config.js';
import db from './firebase.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'TapNova',
    message: 'TapNova Telegram Tap-to-Earn Bot is running.'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    server: 'ok',
    firebase: db ? 'connected' : 'not_configured'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

app.listen(config.port, () => {
  console.log('=================================');
  console.log('        TAPNOVA SERVER');
  console.log('=================================');
  console.log(`Server running on port ${config.port}`);
  console.log(`Health: http://localhost:${config.port}/health`);
  console.log(`Firebase: ${db ? 'Connected' : 'Not configured'}`);
});