"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasValidConfig =
  typeof firebaseConfig.apiKey === "string" &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith("your_");

// Only init on client; avoid re-initializing in Next dev / hot reload
function getAppSafe() {
  if (typeof window === "undefined") return null;
  if (!hasValidConfig) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = typeof window !== "undefined" ? getAppSafe() : null;

export function getAuthSafe() {
  return firebaseApp ? getAuth(firebaseApp) : null;
}

export function getFirestoreSafe() {
  return firebaseApp ? getFirestore(firebaseApp) : null;
}
