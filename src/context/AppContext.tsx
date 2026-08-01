import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Page, Client, Task, User, Notification, Chat } from '../types';

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  editingClient: Client | null;
  setEditingClient: (client: Client | null) => void;
  
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  exchangeRates: { [key: string]: number };

  addClient: (clientData: Partial<Client>) => void;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addTask: (taskData: Partial<Task>) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  navigateToClientDetails: (client: Client) => void;
  navigateToEditClient: (client: Client) => void;
  navigateToAddClient: () => void;
  navigateBackToClients: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('bedaya_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bedaya_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bedaya_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const exchangeRates = { USD: 1, EUR: 0.92, SAR: 3.75 };

  useEffect(() => {
    localStorage.setItem('bedaya_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('bedaya_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('bedaya_users', JSON.stringify(users));
  }, [users]);

  const addClient = useCallback((clientData: Partial<Client>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: clientData.name || 'عميل جديد',
      email: clientData.email || '',
      phone: clientData.phone || '',
      status: clientData.status || 'active',
      createdAt: new Date().toISOString(),
      ...clientData,
    };
    setClients(prev => [newClient, ...prev]);
    setPage('clients');
  }, []);

  const updateClient = useCallback((id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c));
    setPage('clients');
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  const addTask = useCallback((taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'مهمة جديدة',
      status: taskData.status || 'pending',
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskData } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const navigateToClientDetails = useCallback((client: Client) => {
    setSelectedClient(client);
    setPage('client-details');
  }, []);

  const navigateToEditClient = useCallback((client: Client) => {
    setEditingClient(client);
    setPage('edit-client');
  }, []);

  const navigateToAddClient = useCallback(() => {
    setEditingClient(null);
    setPage('add-client');
  }, []);

  const navigateBackToClients = useCallback(() => {
    setSelectedClient(null);
    setEditingClient(null);
    setPage('clients');
  }, []);

  const value = useMemo(
    () => ({
      page, setPage, sidebarOpen, setSidebarOpen,
      selectedClient, setSelectedClient, editingClient, setEditingClient,
      clients, setClients, tasks, setTasks, users, setUsers,
      notifications, setNotifications, chats, setChats, exchangeRates,
      addClient, updateClient, deleteClient, addTask, updateTask, deleteTask,
      navigateToClientDetails, navigateToEditClient, navigateToAddClient, navigateBackToClients,
    }),
    [page, sidebarOpen, selectedClient, editingClient, clients, tasks, users, notifications, chats, addClient, updateClient, deleteClient, addTask, updateTask, deleteTask, navigateToClientDetails, navigateToEditClient, navigateToAddClient, navigateBackToClients]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}