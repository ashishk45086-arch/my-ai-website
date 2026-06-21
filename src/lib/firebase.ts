import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGA35cyWsilCZSzlDN5Rt-1A3XOx7z9o0",
  authDomain: "pg-in-phagwara.firebaseapp.com",
  projectId: "pg-in-phagwara",
  storageBucket: "pg-in-phagwara.firebasestorage.app",
  messagingSenderId: "612787089693",
  appId: "1:612787089693:web:bbd0f8cef7d9a9f3aeb1f4",
  measurementId: "G-J3CN4WMSN2"
};

// Initialize Firebase. Handle SSR or re-initialization safely.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe Analytics init for SSR/iFrame environments
let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => {
      return isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    })
    .catch((err) => {
      console.warn("Analytics error or blocked in environment:", err);
    });
}

export { app, analytics };
