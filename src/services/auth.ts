import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

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
  role: 'admin' | 'manager' | 'sales' = 'sales'
) {
  if (!auth || !db) throw new Error('Firebase not initialized.');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    displayName,
    role,
    photoURL: user.photoURL || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return user;
}

export async function getUserData(uid: string) {
  if (!db) throw new Error('Firestore not initialized.');
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() };
}
