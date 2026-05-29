/* ============================================================
   FATIH AKILLI SOFRA — Firebase Configuration
   Firestore database + Analytics initialization
   ============================================================ */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  setDoc,
  limit,
  writeBatch
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// ── Firebase Project Configuration ──────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyDzKoAtEAOkTfCj6SSeQh6ee3fg-w47VqE',
  authDomain: 'fatih-belediyesi-ff77e.firebaseapp.com',
  projectId: 'fatih-belediyesi-ff77e',
  storageBucket: 'fatih-belediyesi-ff77e.firebasestorage.app',
  messagingSenderId: '579890410349',
  appId: '1:579890410349:web:8a896d5408fe85767aa064',
  measurementId: 'G-8X3Y8TXH6Z'
};

// ── Initialize Firebase ─────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics — wrapped in try/catch for environments where it's blocked
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn('Firebase Analytics could not be initialized:', e.message);
}

// ── Export everything needed by the app ──────────────────────
export {
  db,
  analytics,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  setDoc,
  limit,
  writeBatch
};

export default app;
