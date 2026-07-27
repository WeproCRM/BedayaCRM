{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export function sanitizeKey(value: string): string \{\
  return value\
    .toLowerCase()\
    .replace(/[^a-z0-9]/g, '_')\
    .replace(/_+/g, '_')\
    .replace(/^_|_$/g, '');\
\}\
\
export function formatDate(dateString?: string): string \{\
  if (!dateString) return '-';\
  const date = new Date(dateString);\
  return new Intl.DateTimeFormat('ar-SA', \{\
    year: 'numeric',\
    month: 'short',\
    day: 'numeric',\
    hour: '2-digit',\
    minute: '2-digit',\
  \}).format(date);\
\}\
\
export function formatCurrency(amount: number, currency: 'USD' | 'ILS' | 'SAR'): string \{\
  return new Intl.NumberFormat('ar-SA', \{\
    style: 'currency',\
    currency,\
  \}).format(amount);\
\}\
\
export function generateId(): string \{\
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);\
\}}