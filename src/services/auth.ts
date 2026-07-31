import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';

export function login(email: string, password: string) {
  if (!auth) throw new Error('Firebase Auth not initialized. Check env vars.');
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    console.warn('Firebase Auth not initialized. Auth state will not be tracked.');
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
