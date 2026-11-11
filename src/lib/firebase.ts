/**
 * NY2Bolivia Web (Andean Skyline Logistics)
 * Modular Firebase Client Configuration
 * Target: src/lib/firebase.ts
 *
 * Designed for Next.js 15 (App Router). Supports optional environment variables
 * with zero crashes when running in offline mock mode or during automated CI builds.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validates whether the Firebase environment variables are actively configured
 * with non-placeholder values.
 */
function isConfigurationActive(config: FirebaseClientConfig): boolean {
  const { apiKey, projectId } = config;
  if (!apiKey || !projectId) return false;
  const lowerKey = apiKey.toLowerCase();
  const lowerProject = projectId.toLowerCase();
  if (lowerKey.includes('placeholder') || lowerKey.includes('your_firebase') || apiKey === '') return false;
  if (lowerProject.includes('placeholder') || lowerProject.includes('your_project') || projectId === '') return false;
  return true;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
const isConfigured: boolean = isConfigurationActive(firebaseConfig);

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    if (process.env.NODE_ENV === 'development') {
      console.info('✓ [Firebase] Initialized live Firestore & Storage client for project:', firebaseConfig.projectId);
    }
  } catch (error) {
    console.warn('⚠️ [Firebase] Initialization error encountered; falling back to offline mock mode:', error);
    app = null;
    db = null;
    storage = null;
  }
} else {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.info('ℹ️ [Firebase] No live credentials detected. Running in 100% offline mock mode with LocalStorage persistence.');
  }
}

export const isFirebaseConfigured: boolean = isConfigured && db !== null;
export { app, db, storage, firebaseConfig };
export default app;
