import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Firestore,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Client, Task, User, Notification, Chat, ExchangeRates } from '../types';

function ensureDb(): Firestore {
  if (!db) {
    throw new Error('Firestore is not initialized. Check your Firebase config.');
  }
  return db;
}

function mapDoc<T>(docSnap: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void
) {
  const database = ensureDb();
  const q = query(collection(database, collectionName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => mapDoc<T>(d));
    callback(data);
  });
}

export async function getCollection<T>(collectionName: string): Promise<(T & { id: string })[]> {
  const database = ensureDb();
  const snapshot = await getDocs(collection(database, collectionName));
  return snapshot.docs.map((d) => mapDoc<T>(d));
}

export async function getDocument<T>(collectionName: string, id: string): Promise<(T & { id: string }) | null> {
  const database = ensureDb();
  const docRef = doc(database, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export async function addDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
) {
  const database = ensureDb();
  return addDoc(collection(database, collectionName), { ...data, createdAt: new Date().toISOString() });
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>
) {
  const database = ensureDb();
  return updateDoc(doc(database, collectionName, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteDocument(collectionName: string, id: string) {
  const database = ensureDb();
  return deleteDoc(doc(database, collectionName, id));
}

export function subscribeToClients(callback: (clients: Client[]) => void) {
  return subscribeToCollection<Client>('clients', callback);
}

export function subscribeToTasks(callback: (tasks: Task[]) => void) {
  return subscribeToCollection<Task>('tasks', callback);
}

export function subscribeToNotifications(callback: (notifications: Notification[]) => void) {
  return subscribeToCollection<Notification>('notifications', callback);
}

export function subscribeToChats(callback: (chats: Chat[]) => void) {
  return subscribeToCollection<Chat>('chats', callback);
}

export function subscribeToExchangeRates(callback: (rates: ExchangeRates) => void) {
  const database = ensureDb();
  return onSnapshot(doc(database, 'settings', 'currency'), (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    callback({
      usd: 1,
      ils: Number(data?.ilsRate) || 3,
      sar: Number(data?.sarRate) || 3.75,
    });
  });
}

export async function getUsers(): Promise<(User & { id: string })[]> {
  return getCollection<User>('users');
}
