import { useState, useEffect } from 'react';
import {
  subscribeToClients,
  subscribeToTasks,
  subscribeToNotifications,
  subscribeToChats,
  subscribeToExchangeRates,
} from '../services/firestore';
import type { Client, Task, Notification, Chat, ExchangeRates } from '../types';

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
