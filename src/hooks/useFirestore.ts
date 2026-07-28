import { useState, useEffect } from 'react';
import {
  subscribeToClients,
  subscribeToTasks,
  subscribeToNotifications,
  subscribeToChats,
  subscribeToExchangeRates,
} from '../services/firestore';
import type { Client, Task, Notification, Chat, ExchangeRates } from '../types';
import { DEFAULT_EXCHANGE_RATES } from '../constants';

interface FirestoreState {
  clients: Client[];
  tasks: Task[];
  notifications: Notification[];
  chats: Chat[];
  exchangeRates: ExchangeRates;
  isLoading: boolean;
}

export function useFirestore(): FirestoreState {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubClients = subscribeToClients((data) => {
      setClients(data);
      setIsLoading(false);
    });
    const unsubTasks = subscribeToTasks(setTasks);
    const unsubNotifications = subscribeToNotifications(setNotifications);
    const unsubChats = subscribeToChats(setChats);
    const unsubRates = subscribeToExchangeRates(setExchangeRates);

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
