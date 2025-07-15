// backend/src/utils/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from '../config/datashop-1-firebase-adminsdk-fbsvc-06a4422795.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    storageBucket: 'datashop-1.firebasestorage.app', // Thay bằng bucket của bạn
  });
}

const bucket = admin.storage().bucket();
export { bucket };