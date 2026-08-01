export type RoleType = 'super-admin' | 'admin' | 'manager' | 'employee' | string;

export type PermissionType = string;

export type ClientStage = 'previous' | 'in_progress' | 'negotiation' | 'new';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SocialMedia {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  telegram?: string;
}

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
  whatsapp?: string;
  company?: string;
  jobTitle?: string;
  socialMedia?: SocialMedia;
  serviceRequired?: string;
  stage: ClientStage;
  status?: 'active' | 'inactive' | 'lead' | string;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  [key: string]: any;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  assignedToName?: string;
  clientId?: string;
  clientName?: string;
  dueDate?: string;
  subTasks?: SubTask[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  read: boolean;
  link?: string;
  type?: 'task' | 'client' | 'system' | 'chat';
  createdAt?: string;
  readAt?: string;
  [key: string]: any;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames?: string[];
  unreadBy?: { [key: string]: boolean };
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt?: string;
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
  | 'task-details'
  | 'add-task'
  | 'edit-task'
  | 'team'
  | 'notifications' 
  | 'chat'
  | 'chat-room'
  | 'settings'
  | 'audit-logs';
