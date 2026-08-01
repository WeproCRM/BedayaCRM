export type RoleType = 'super-admin' | 'admin' | 'manager' | 'employee' | string;

export type PermissionType = 
  | 'clients.view' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'tasks.view' | 'tasks.create' | 'tasks.edit' | 'tasks.delete'
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'settings.manage' | 'reports.view' | 'reports.export' | 'notifications.manage';

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
  status: 'active' | 'inactive' | 'suspended';
  managerId?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string; // e.g., 'CREATE_USER', 'DELETE_USER', 'UPDATE_CLIENT'
  targetType: 'user' | 'client' | 'task' | 'settings';
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