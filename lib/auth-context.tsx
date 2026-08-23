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
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as Crypto from "expo-crypto";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  verificationKey: string | null;
  isVerified: boolean;
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
  activateVerification: (verificationKey: string) => Promise<boolean>;
  generateVerificationKey: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
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
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName,
        verificationKey: null,
        isVerified: false,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, "users", cred.user.uid), userProfile);
      setProfile(userProfile);
    },
    [],
  );

  const generateVerificationKey = useCallback(async (): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    const newKey = Crypto.randomUUID();
    await updateDoc(doc(db, "users", user.uid), { verificationKey: newKey });
    setProfile((prev) => (prev ? { ...prev, verificationKey: newKey } : prev));
    return newKey;
  }, [user]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  }, []);

  const activateVerification = useCallback(
    async (verificationKey: string): Promise<boolean> => {
      if (!user) return false;

      // Read the current user's document directly
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return false;

      const data = userDoc.data() as UserProfile;
      if (data.verificationKey !== verificationKey) return false;

      // Key matches — activate verification
      await updateDoc(doc(db, "users", user.uid), { isVerified: true });
      setProfile((prev) => (prev ? { ...prev, isVerified: true } : prev));
      return true;
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, signIn, signOut, activateVerification, generateVerificationKey }}
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
