import { useState, useEffect, useCallback } from 'react';
import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../services/firestore';

interface UseCollectionOptions {
  path: string;
  enabled?: boolean;
}

export function useCollection<T = any>({ path, enabled = true }: UseCollectionOptions) {
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

export function useDocument<T = any>(path: string, id: string | undefined) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDocument<T>(path, id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [path, id]);

  return { data, loading, error };
}

export function useFirestoreMutations<T extends object>(path: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (data: T) => {
      setLoading(true);
      setError(null);
      try {
        return await addDocument(path, data);
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
        await updateDocument(path, id, data);
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
