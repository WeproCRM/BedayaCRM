import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Client, Task, User, Notification, Chat, ExchangeRates } from '../types';

function mapDoc<T>(docSnap: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void
) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => mapDoc<T>(d));
    callback(data);
  });
}

export async function getCollection<T>(collectionName: string): Promise<(T & { id: string })[]> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((d) => mapDoc<T>(d));
}

export async function addDocument<T>(collectionName: string, data: T) {
  return addDoc(collection(db, collectionName), { ...data, createdAt: new Date().toISOString() });
}

export async function updateDocument<T>(collectionName: string, id: string, data: Partial<T>) {
  return updateDoc(doc(db, collectionName, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteDocument(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
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
  return onSnapshot(doc(db, 'settings', 'currency'), (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    callback({
      usd: 1,
      ils: Number(data?.ilsRate) || 3,
      sar: Number(data?.sarRate) || 3.75,
    });
  });
}

export async function getUsers(): Promise<User[]> {
  return getCollection<User>('users');
}
