import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';

export function login(email: string, password: string) {
  if (!auth) throw new Error('Firebase Auth not initialized.');
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: 'admin' | 'manager' | 'employee' | 'super-admin' = 'employee',
  extraData?: Record<string, any>
) {
  if (!auth || !db) throw new Error('Firebase not initialized.');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    displayName,
    name: displayName,
    role,
    photoURL: user.photoURL || '',
    status: 'active',
    ...extraData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return user;
}

export async function createUserByAdmin(
  email: string,
  password: string,
  displayName: string,
  role: 'admin' | 'manager' | 'employee' | 'super-admin' = 'employee',
  extraData?: Record<string, any>
) {
  if (!db) throw new Error('Firebase not initialized.');

  // Create user document directly (admin creates user without signing in)
  const userRef = doc(collection(db, 'users'));
  const userId = userRef.id;

  await setDoc(userRef, {
    uid: userId,
    id: userId,
    email,
    displayName,
    name: displayName,
    role,
    status: 'active',
    password: password, // Note: In production, use Firebase Admin SDK
    ...extraData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return userId;
}

import { collection } from 'firebase/firestore';

export async function getUserData(uid: string) {
  if (!db) throw new Error('Firestore not initialized.');
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() };
}

export async function updateUserLastLogin(uid: string) {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), {
    lastLogin: new Date().toISOString(),
    updatedAt: Timestamp.now(),
  });
}
