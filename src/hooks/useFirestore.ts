{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ useState, useEffect \} from 'react';\
import \{\
  subscribeToClients,\
  subscribeToTasks,\
  subscribeToNotifications,\
  subscribeToChats,\
  subscribeToExchangeRates,\
\} from '../services/firestore';\
import type \{ Client, Task, Notification, Chat, ExchangeRates \} from '../types';\
import \{ DEFAULT_EXCHANGE_RATES \} from '../constants';\
\
interface FirestoreState \{\
  clients: Client[];\
  tasks: Task[];\
  notifications: Notification[];\
  chats: Chat[];\
  exchangeRates: ExchangeRates;\
  isLoading: boolean;\
\}\
\
export function useFirestore(): FirestoreState \{\
  const [clients, setClients] = useState<Client[]>([]);\
  const [tasks, setTasks] = useState<Task[]>([]);\
  const [notifications, setNotifications] = useState<Notification[]>([]);\
  const [chats, setChats] = useState<Chat[]>([]);\
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(DEFAULT_EXCHANGE_RATES);\
  const [isLoading, setIsLoading] = useState(true);\
\
  useEffect(() => \{\
    const unsubClients = subscribeToClients((data) => \{\
      setClients(data);\
      setIsLoading(false);\
    \});\
    const unsubTasks = subscribeToTasks(setTasks);\
    const unsubNotifications = subscribeToNotifications(setNotifications);\
    const unsubChats = subscribeToChats(setChats);\
    const unsubRates = subscribeToExchangeRates(setExchangeRates);\
\
    return () => \{\
      unsubClients();\
      unsubTasks();\
      unsubNotifications();\
      unsubChats();\
      unsubRates();\
    \};\
  \}, []);\
\
  return \{ clients, tasks, notifications, chats, exchangeRates, isLoading \};\
\}}