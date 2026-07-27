{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export interface User \{\
  id: string;\
  name: string;\
  email: string;\
  role: 'employee' | 'admin' | 'super-admin';\
  avatar?: string;\
  createdAt?: string;\
\}\
\
export interface Client \{\
  id: string;\
  name: string;\
  email?: string;\
  phone?: string;\
  company?: string;\
  status?: 'active' | 'inactive' | 'lead';\
  notes?: string;\
  createdAt: string;\
  createdBy: string;\
  updatedAt?: string;\
\}\
\
export interface Task \{\
  id: string;\
  title: string;\
  description?: string;\
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';\
  priority?: 'low' | 'medium' | 'high';\
  clientId?: string;\
  assignedTo?: string;\
  checklist?: ChecklistItem[];\
  createdAt: string;\
  createdBy: string;\
  createdByEmail: string;\
  updatedAt?: string;\
  dueDate?: string;\
\}\
\
export interface ChecklistItem \{\
  id: string;\
  text: string;\
  completed: boolean;\
\}\
\
export interface Notification \{\
  id: string;\
  title: string;\
  message: string;\
  read: boolean;\
  readAt?: string;\
  recipientEmail?: string;\
  link?: string;\
  createdAt: string;\
\}\
\
export interface Chat \{\
  id: string;\
  participants: string[];\
  lastMessage?: string;\
  lastMessageAt?: string;\
  unreadBy: Record<string, number>;\
\}\
\
export interface ExchangeRates \{\
  usd: number;\
  ils: number;\
  sar: number;\
\}\
\
export type Page =\
  | 'dashboard'\
  | 'clients'\
  | 'client-details'\
  | 'add-client'\
  | 'edit-client'\
  | 'tasks'\
  | 'team'\
  | 'notifications'\
  | 'chat'\
  | 'settings';}
