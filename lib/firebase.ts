import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVjt-uis7rUfh4LSHnQxwA8otA13Oj_-M",
  authDomain: "glitchit-749c0.firebaseapp.com",
  projectId: "glitchit-749c0",
  storageBucket: "glitchit-749c0.firebasestorage.app",
  messagingSenderId: "528294753215",
  appId: "1:528294753215:web:bc433d9d173c0b95b4670a",
  measurementId: "G-75V7YGZ9C5",
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  // Firebase init failed — create fallback objects so the app doesn't crash
  console.warn("Firebase init failed:", error);
  // These will throw if actually called, but won't crash the app at startup
  app = null as any;
  db = null as any;
  auth = null as any;
}

export { db, auth };
export default app;
