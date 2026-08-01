// src/types/index.ts

export type Page = 'dashboard' | 'clients' | 'add-client' | 'client-details' | 'edit-client' | 'tasks' | 'team' | 'currencies' | 'settings' | 'notifications' | 'chat';

export type RoleType = 'super-admin' | 'admin' | 'employee';

export interface RoleDefinition {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  uid: string;
  name?: string;
  displayName?: string;
  email: string;
  role: RoleType;
  department?: string;
  jobTitle?: string;
  status?: 'active' | 'inactive';
  phone?: string;
  managerId?: string;
  permissions?: string[];
  createdAt?: any;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'active' | 'lead' | 'inactive' | 'closed';
  notes?: string;
  assignedTo?: string;
  currency?: string;
  createdAt?: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientId?: string;
  assignedTo?: string;
  dueDate?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt?: any;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: any;
}

export interface Chat {
  id: string;
  unreadBy?: string[];
  participants?: string[];
  lastMessage?: string;
  updatedAt?: any;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  userName: string;
  createdAt: any;
}