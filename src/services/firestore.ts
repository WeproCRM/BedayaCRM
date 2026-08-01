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
  where,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Firestore,
  writeBatch,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Client, Task, User, Notification, Chat, ChatMessage, ExchangeRates } from '../types';

function ensureDb(): Firestore {
  if (!db) {
    throw new Error('Firestore is not initialized. Check your Firebase config.');
  }
  return db;
}

function mapDoc<T>(docSnap: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

// ============ Auto-Initialize Collections ============

let initialized = false;

export async function initializeCollections() {
  if (initialized || !db) return;
  initialized = true;

  try {
    const database = ensureDb();

    // Check if chatMessages collection exists by trying to query it
    const chatMessagesQuery = query(collection(database, 'chatMessages'), limit(1));
    const chatMessagesSnap = await getDocs(chatMessagesQuery);

    if (chatMessagesSnap.empty) {
      // Create a system initialization message
      await addDoc(collection(database, 'chatMessages'), {
        chatId: 'system',
        senderId: 'system',
        senderName: 'النظام',
        content: 'تم تهيئة نظام الدردشة بنجاح',
        createdAt: Timestamp.now(),
      });
      console.log('✅ chatMessages collection initialized');
    }

    // Check if auditLogs collection exists
    const auditLogsQuery = query(collection(database, 'auditLogs'), limit(1));
    const auditLogsSnap = await getDocs(auditLogsQuery);

    if (auditLogsSnap.empty) {
      await addDoc(collection(database, 'auditLogs'), {
        userId: 'system',
        userName: 'النظام',
        action: 'SYSTEM_INIT',
        targetType: 'system',
        targetId: 'system',
        newValue: { message: 'System initialized' },
        createdAt: Timestamp.now(),
      });
      console.log('✅ auditLogs collection initialized');
    }

    // Check if settings/currency document exists
    const currencyDoc = await getDoc(doc(database, 'settings', 'currency'));
    if (!currencyDoc.exists()) {
      await setDoc(doc(database, 'settings', 'currency'), {
        usd: 1,
        ils: 3,
        sar: 3.75,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ currency settings initialized');
    }

    // Check if settings/general document exists
    const generalDoc = await getDoc(doc(database, 'settings', 'general'));
    if (!generalDoc.exists()) {
      await setDoc(doc(database, 'settings', 'general'), {
        companyName: 'Bedaya CRM',
        language: 'ar',
        timezone: 'Asia/Riyadh',
        updatedAt: Timestamp.now(),
      });
      console.log('✅ general settings initialized');
    }

    console.log('✅ All collections initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
  }
}

// ============ Generic Collection Operations ============

export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  orderField: string = 'createdAt'
) {
  const database = ensureDb();
  const q = query(collection(database, collectionName), orderBy(orderField, 'desc'));
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
  return addDoc(collection(database, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>
) {
  const database = ensureDb();
  return updateDoc(doc(database, collectionName, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteDocument(collectionName: string, id: string) {
  const database = ensureDb();
  return deleteDoc(doc(database, collectionName, id));
}

// ============ Batch Operations for Import/Export ============

export async function batchAddDocuments<T extends Record<string, unknown>>(
  collectionName: string,
  items: T[]
) {
  const database = ensureDb();
  const batch = writeBatch(database);
  const colRef = collection(database, collectionName);

  items.forEach((item) => {
    const docRef = doc(colRef);
    batch.set(docRef, {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  await batch.commit();
}

// ============ Specific Subscriptions ============

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
  return subscribeToCollection<Chat>('chats', callback, 'lastMessageAt');
}

export function subscribeToChatMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
  const database = ensureDb();
  const q = query(
    collection(database, 'chatMessages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => mapDoc<ChatMessage>(d));
    callback(data);
  });
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

export async function getChatMessages(chatId: string): Promise<(ChatMessage & { id: string })[]> {
  const database = ensureDb();
  const q = query(
    collection(database, 'chatMessages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDoc<ChatMessage>(d));
}

export async function sendChatMessage(chatId: string, senderId: string, senderName: string, content: string) {
  const database = ensureDb();
  const now = new Date().toISOString();

  // Add message
  await addDoc(collection(database, 'chatMessages'), {
    chatId,
    senderId,
    senderName,
    content,
    createdAt: now,
  });

  // Update chat last message
  await updateDoc(doc(database, 'chats', chatId), {
    lastMessage: content,
    lastMessageAt: now,
  });
}
