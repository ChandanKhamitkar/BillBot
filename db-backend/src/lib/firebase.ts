import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not set.");
}

const firebaseConfig = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8")
  );

// Initialize Firebase
const FirebaseApp = initializeApp({
  credential: cert(firebaseConfig),
  storageBucket: "billbot-d3481.firebasestorage.app",
});

// Get storage bucket
const FirebaseBucket = getStorage().bucket();

export { FirebaseApp, FirebaseBucket };
