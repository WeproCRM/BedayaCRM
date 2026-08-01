import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Page, Client, Task, User, Notification, Chat, TaskStatus } from '../types';

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  editingClient: Client | null;
  setEditingClient: (client: Client | null) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;

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
  moveTask: (taskId: string, newStatus: TaskStatus) => void;

  navigateToClientDetails: (client: Client) => void;
  navigateToEditClient: (client: Client) => void;
  navigateToAddClient: () => void;
  navigateBackToClients: () => void;

  navigateToTaskDetails: (task: Task) => void;
  navigateToEditTask: (task: Task) => void;
  navigateToAddTask: () => void;
  navigateBackToTasks: () => void;

  navigateToChatRoom: (chatId: string) => void;
  navigateBackToChats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const exchangeRates = { USD: 1, EUR: 0.92, SAR: 3.75 };

  const addClient = useCallback((clientData: Partial<Client>) => {
    setClients(prev => [{ id: Date.now().toString(), ...clientData } as Client, ...prev]);
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
    setTasks(prev => [{ id: Date.now().toString(), ...taskData } as Task, ...prev]);
    setPage('tasks');
  }, []);

  const updateTask = useCallback((id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskData } : t));
    setPage('tasks');
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
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

  const navigateToTaskDetails = useCallback((task: Task) => {
    setSelectedTask(task);
    setPage('task-details');
  }, []);

  const navigateToEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setPage('edit-task');
  }, []);

  const navigateToAddTask = useCallback(() => {
    setEditingTask(null);
    setPage('add-task');
  }, []);

  const navigateBackToTasks = useCallback(() => {
    setSelectedTask(null);
    setEditingTask(null);
    setPage('tasks');
  }, []);

  const navigateToChatRoom = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    setPage('chat-room');
  }, []);

  const navigateBackToChats = useCallback(() => {
    setSelectedChatId(null);
    setPage('chat');
  }, []);

  const value = useMemo(
    () => ({
      page, setPage, sidebarOpen, setSidebarOpen,
      selectedClient, setSelectedClient, editingClient, setEditingClient,
      selectedTask, setSelectedTask, editingTask, setEditingTask,
      selectedChatId, setSelectedChatId,
      clients, setClients, tasks, setTasks, users, setUsers,
      notifications, setNotifications, chats, setChats, exchangeRates,
      addClient, updateClient, deleteClient, addTask, updateTask, deleteTask, moveTask,
      navigateToClientDetails, navigateToEditClient, navigateToAddClient, navigateBackToClients,
      navigateToTaskDetails, navigateToEditTask, navigateToAddTask, navigateBackToTasks,
      navigateToChatRoom, navigateBackToChats,
    }),
    [page, sidebarOpen, selectedClient, editingClient, selectedTask, editingTask, selectedChatId,
     clients, tasks, users, notifications, chats,
     addClient, updateClient, deleteClient, addTask, updateTask, deleteTask, moveTask,
     navigateToClientDetails, navigateToEditClient, navigateToAddClient, navigateBackToClients,
     navigateToTaskDetails, navigateToEditTask, navigateToAddTask, navigateBackToTasks,
     navigateToChatRoom, navigateBackToChats]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
