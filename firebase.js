import admin from 'firebase-admin';
import config from './config.js';

let db = null;

function initializeFirebase() {
  if (
    !config.firebase.projectId ||
    !config.firebase.clientEmail ||
    !config.firebase.privateKey ||
    !config.firebase.databaseURL
  ) {
    console.warn('Firebase configuration is incomplete.');
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey
      }),
      databaseURL: config.firebase.databaseURL
    });
  }

  return admin.database();
}

try {
  db = initializeFirebase();
} catch (error) {
  console.error('Firebase initialization failed:', error.message);
  db = null;
}

export { admin, db };

export default db;