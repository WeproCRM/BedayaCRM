// src/types/index.ts

export type RoleType = 'super-admin' | 'admin' | 'manager' | 'sales' | 'employee' | 'custom';

export type Permission =
  | 'clients.view' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'tasks.view' | 'tasks.create' | 'tasks.edit' | 'tasks.delete'
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'settings.manage'
  | 'reports.view' | 'reports.export'
  | 'notifications.manage';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  department?: string;
  jobTitle?: string;
  role: RoleType;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'suspended';
  managerId?: string;
  lastLogin?: any;
  createdAt: any;
  updatedAt?: any;
}

export interface RoleDefinition {
  id: RoleType;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: 'user' | 'client' | 'task' | 'setting' | 'role';
  targetId: string;
  details?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  createdAt: any;
}
