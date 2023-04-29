import { initializeApp, cert, getApps  } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage'

if (!getApps().length) {
    initializeApp({
        credential: cert({
          projectId: process.env.FIREADMIN_PROJECT_ID,
          clientEmail: process.env.FIREADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREADMIN_PRIVATE_KEY ? process.env.FIREADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
        }),
        storageBucket: 'gs://blogstroreimg.appspot.com'
      });      
}

export const bucket = getStorage().bucket();
