export interface User {
  uid: string;
  id?: string;
  email: string;
  displayName: string;
  name?: string;
  role?: string;
  department?: string;
  jobTitle?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export interface Chat {
  id: string;
  messages: any[];
  updatedAt: any;
}

export interface ExchangeRates {
  [currency: string]: number;
}

export interface AuditLog {
  id?: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  newValue?: any;
  createdAt?: any;
}

export type Permission = string;
