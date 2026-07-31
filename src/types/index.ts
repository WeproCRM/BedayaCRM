export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'manager' | 'sales' | 'super-admin';
  avatar?: string;
  createdAt?: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'employee' | 'admin' | 'manager' | 'sales' | 'super-admin';
  photoURL?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'active' | 'inactive' | 'lead';
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  priority?: 'low' | 'medium' | 'high';
  clientId?: string;
  assignedTo?: string;
  checklist?: ChecklistItem[];
  createdAt: string;
  createdBy: string;
  createdByEmail: string;
  updatedAt?: string;
  dueDate?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: string;
  recipientEmail?: string;
  link?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadBy: Record<string, boolean>;
}

export interface ExchangeRates {
  usd: number;
  ils: number;
  sar: number;
}

export type Page =
  | 'dashboard'
  | 'clients'
  | 'client-details'
  | 'add-client'
  | 'edit-client'
  | 'tasks'
  | 'team'
  | 'notifications'
  | 'chat'
  | 'settings';
