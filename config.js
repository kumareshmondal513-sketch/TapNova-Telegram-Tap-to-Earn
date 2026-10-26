import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3000),

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || ''
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    databaseURL: process.env.FIREBASE_DATABASE_URL || ''
  },

  withdrawal: {
    minimumCoins: Number(
      process.env.MIN_WITHDRAWAL_COINS || 5000000
    )
  }
};

export default config;