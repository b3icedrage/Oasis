import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVjt-uis7rUfh4LSHnQxwA8otA13Oj_-M",
  authDomain: "glitchit-749c0.firebaseapp.com",
  projectId: "glitchit-749c0",
  storageBucket: "glitchit-749c0.firebasestorage.app",
  messagingSenderId: "528294753215",
  appId: "1:528294753215:web:bc433d9d173c0b95b4670a",
  measurementId: "G-75V7YGZ9C5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
