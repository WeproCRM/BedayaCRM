// src/constants/permissions.ts
import { RoleDefinition } from '../types';

export const PERMISSIONS = {
  VIEW_CLIENTS: 'view_clients',
  MANAGE_CLIENTS: 'manage_clients',
  DELETE_CLIENTS: 'delete_clients',
  VIEW_TASKS: 'view_tasks',
  MANAGE_TASKS: 'manage_tasks',
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
};

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'super-admin',
    name: 'مدير عام',
    description: 'صلاحيات كاملة على النظام',
    permissions: Object.values(PERMISSIONS),
  },
  {
    id: 'admin',
    name: 'مدير',
    description: 'إدارة العملاء والمهام والموظفين',
    permissions: [
      PERMISSIONS.VIEW_CLIENTS,
      PERMISSIONS.MANAGE_CLIENTS,
      PERMISSIONS.VIEW_TASKS,
      PERMISSIONS.MANAGE_TASKS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.MANAGE_USERS,
    ],
  },
  {
    id: 'employee',
    name: 'موظف',
    description: 'عرض العملاء والمهام الخاصة به فقط',
    permissions: [
      PERMISSIONS.VIEW_CLIENTS,
      PERMISSIONS.VIEW_TASKS,
    ],
  },
];