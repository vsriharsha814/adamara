const admin = require('firebase-admin');

let app;

function getPrivateKeyFromEnv() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  // Common when storing multiline secrets in env vars
  return key.replace(/\\n/g, '\n');
}

function initFirebase() {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKeyFromEnv();

  if (projectId && clientEmail && privateKey) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    return app;
  }

  // Fallback: use GOOGLE_APPLICATION_CREDENTIALS / Application Default Credentials
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  return app;
}

function getFirestore() {
  initFirebase();
  return admin.firestore();
}

module.exports = {
  admin,
  initFirebase,
  getFirestore
};
