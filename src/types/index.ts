export type RoleType = 'super-admin' | 'admin' | 'manager' | 'employee' | string;

export type PermissionType = string;

export interface User {
  uid: string;
  id?: string;
  displayName?: string;
  name?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  department?: string;
  jobTitle?: string;
  role: RoleType;
  permissions?: PermissionType[];
  status?: 'active' | 'inactive' | 'suspended' | string;
  managerId?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  assignedTo?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  clientId?: string;
  dueDate?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface Chat {
  id: string;
  unreadBy?: { [key: string]: boolean };
  lastMessage?: string;
  [key: string]: any;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface RoleDefinition {
  id: RoleType;
  name: string;
  description?: string;
  permissions: PermissionType[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  targetType: string;
  targetId?: string;
  oldValue?: any;
  newValue?: any;
  createdAt: string;
  createdBy?: string;
}

export type Page = 
  | 'dashboard' 
  | 'clients' 
  | 'client-details' 
  | 'add-client' 
  | 'edit-client' 
  | 'tasks' 
  | 'notifications' 
  | 'chat' 
  | 'settings';