import { useState, useEffect, useCallback } from 'react';
import {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  subscribeToClients,
  subscribeToTasks,
  subscribeToNotifications,
  subscribeToChats,
  subscribeToExchangeRates,
} from '../services/firestore';
import type { Client, Task, Notification, Chat, ExchangeRates } from '../types';

interface UseCollectionOptions {
  path: string;
  enabled?: boolean;
}

export function useCollection<T extends Record<string, unknown>>({ path, enabled = true }: UseCollectionOptions) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getCollection<T>(path);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [path, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refresh: fetch };
}

export function useFirestoreMutations<T extends Record<string, unknown>>(path: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (data: T) => {
      setLoading(true);
      setError(null);
      try {
        return await addDocument<T>(path, data);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        await updateDocument<T>(path, id, data);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteDocument(path, id);
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  return { add, update, remove, loading, error };
}

export function useFirestore() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ usd: 1, ils: 3, sar: 3.75 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const unsubClients = subscribeToClients((data) => {
      setClients(data);
      setIsLoading(false);
    });

    const unsubTasks = subscribeToTasks((data) => {
      setTasks(data);
    });

    const unsubNotifications = subscribeToNotifications((data) => {
      setNotifications(data);
    });

    const unsubChats = subscribeToChats((data) => {
      setChats(data);
    });

    const unsubRates = subscribeToExchangeRates((data) => {
      setExchangeRates(data);
    });

    return () => {
      unsubClients();
      unsubTasks();
      unsubNotifications();
      unsubChats();
      unsubRates();
    };
  }, []);

  return { clients, tasks, notifications, chats, exchangeRates, isLoading };
}
