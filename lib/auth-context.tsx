import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Gracefully handle Firebase not being initialized
const isFirebaseReady = auth != null && db != null;

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isVerified: boolean;
  verifiedUntil: number | null;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  activateVerification: () => Promise<boolean>;
  isVerificationActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if verification is currently active (not expired)
  const isVerificationActive =
    profile?.isVerified === true &&
    profile?.verifiedUntil != null &&
    profile.verifiedUntil > Date.now();

  // Listen to Firebase auth state
  useEffect(() => {
    if (!isFirebaseReady) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Auto-expire verification if past the date
            if (
              data.isVerified &&
              data.verifiedUntil &&
              data.verifiedUntil < Date.now()
            ) {
              await updateDoc(doc(db, "users", firebaseUser.uid), {
                isVerified: false,
              });
              data.isVerified = false;
            }
            setProfile(data);
          }
        } catch (e) {
          console.warn("Failed to load user profile:", e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!isFirebaseReady) throw new Error("Firebase not initialized");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName,
        isVerified: false,
        verifiedUntil: null,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, "users", cred.user.uid), userProfile);
      setProfile(userProfile);
    },
    [],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!isFirebaseReady) throw new Error("Firebase not initialized");
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!isFirebaseReady) throw new Error("Firebase not initialized");
    await firebaseSignOut(auth);
    setProfile(null);
  }, []);

  // Called after successful payment redirect — activates 1-month verification
  const activateVerification = useCallback(async (): Promise<boolean> => {
    if (!user || !isFirebaseReady) return false;

    const verifiedUntil = Date.now() + ONE_MONTH_MS;
    await updateDoc(doc(db, "users", user.uid), {
      isVerified: true,
      verifiedUntil,
    });
    setProfile((prev) =>
      prev ? { ...prev, isVerified: true, verifiedUntil } : prev,
    );
    return true;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        activateVerification,
        isVerificationActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
