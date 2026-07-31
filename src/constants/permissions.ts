// src/constants/permissions.ts
import { Permission, RoleDefinition } from '../types';

export const ALL_PERMISSIONS: { id: Permission; label: string; group: string }[] = [
  { id: 'clients.view', label: 'عرض العملاء', group: 'العملاء' },
  { id: 'clients.create', label: 'إضافة عميل', group: 'العملاء' },
  { id: 'clients.edit', label: 'تعديل عميل', group: 'العملاء' },
  { id: 'clients.delete', label: 'حذف عميل', group: 'العملاء' },
  
  { id: 'tasks.view', label: 'عرض المهام', group: 'المهام' },
  { id: 'tasks.create', label: 'إنشاء مهمة', group: 'المهام' },
  { id: 'tasks.edit', label: 'تعديل مهمة', group: 'المهام' },
  { id: 'tasks.delete', label: 'حذف مهمة', group: 'المهام' },

  { id: 'users.view', label: 'عرض الموظفين', group: 'إدارة الفريق' },
  { id: 'users.create', label: 'إضافة موظف', group: 'إدارة الفريق' },
  { id: 'users.edit', label: 'تعديل موظف', group: 'إدارة الفريق' },
  { id: 'users.delete', label: 'حذف/تعطيل موظف', group: 'إدارة الفريق' },

  { id: 'settings.manage', label: 'إدارة الإعدادات بالنظام', group: 'الإعدادات' },
  { id: 'reports.view', label: 'عرض التقارير', group: 'التقارير' },
  { id: 'reports.export', label: 'تصدير التقارير', group: 'التقارير' },
  { id: 'notifications.manage', label: 'إدارة الإشعارات العامة', group: 'الإشعارات' },
];

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'صلاحيات كاملة وغير محدودة على كل النظام',
    permissions: ALL_PERMISSIONS.map(p => p.id),
  },
  {
    id: 'admin',
    name: 'مدير نظام',
    description: 'صلاحيات واسعة لإدارة العملاء والمهام والمستخدمين',
    permissions: ALL_PERMISSIONS.filter(p => p.id !== 'users.delete').map(p => p.id),
  },
  {
    id: 'manager',
    name: 'مدير قسم',
    description: 'إدارة العملاء والمهام والتقارير',
    permissions: ['clients.view', 'clients.create', 'clients.edit', 'tasks.view', 'tasks.create', 'tasks.edit', 'reports.view'],
  },
  {
    id: 'sales',
    name: 'مبيعات',
    description: 'متابعة وإضافة العملاء والمهام الخاصة بها',
    permissions: ['clients.view', 'clients.create', 'clients.edit', 'tasks.view', 'tasks.create', 'tasks.edit'],
  },
  {
    id: 'employee',
    name: 'موظف',
    description: 'عرض ومتابعة المهام المسندة إليه فقط',
    permissions: ['tasks.view', 'tasks.edit'],
  }
];
