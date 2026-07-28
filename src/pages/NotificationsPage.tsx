{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ updateDocument \} from '../services/firestore';\
import \{ useApp \} from '../context/AppContext';\
import \{ formatDate \} from '../utils';\
import type \{ Notification \} from '../types';\
\
interface Props \{\
  notifications: Notification[];\
\}\
\
export function NotificationsPage(\{ notifications \}: Props) \{\
  const \{ setPage \} = useApp();\
\
  const handleMarkRead = async (n: Notification) => \{\
    await updateDocument('notifications', n.id, \{ read: true, readAt: new Date().toISOString() \});\
  \};\
\
  const handleMarkAllRead = async () => \{\
    const unread = notifications.filter((n) => !n.read);\
    await Promise.all(unread.map((n) => updateDocument('notifications', n.id, \{ read: true, readAt: new Date().toISOString() \})));\
  \};\
\
  const handleOpen = async (n: Notification) => \{\
    if (!n.read) await handleMarkRead(n);\
    const routeMap: Record<string, string> = \{ '/tasks': 'tasks', '/clients': 'clients', '/team': 'team', '/chat': 'chat', '/notifications': 'notifications' \};\
    setPage((routeMap[n.link || ''] || 'dashboard') as any);\
  \};\
\
  return (\
    <div className="space-y-6">\
      <div className="flex items-center justify-between">\
        <h1 className="text-white text-2xl font-bold">\uc0\u1575 \u1604 \u1573 \u1588 \u1593 \u1575 \u1585 \u1575 \u1578 </h1>\
        \{notifications.some((n) => !n.read) && (\
          <button onClick=\{handleMarkAllRead\} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">\
            \uc0\u1578 \u1593 \u1610 \u1610 \u1606  \u1575 \u1604 \u1603 \u1604  \u1603 \u1605 \u1602 \u1585 \u1608 \u1569 \
          </button>\
        )\}\
      </div>\
\
      <div className="space-y-3">\
        \{notifications.length === 0 ? (\
          <div className="text-center py-16 text-white/50">\uc0\u1604 \u1575  \u1578 \u1608 \u1580 \u1583  \u1573 \u1588 \u1593 \u1575 \u1585 \u1575 \u1578 </div>\
        ) : (\
          notifications.map((n) => (\
            <div key=\{n.id\} onClick=\{() => handleOpen(n)\} className=\{`bg-[#111c2d] rounded-2xl p-5 border cursor-pointer transition-colors $\{n.read ? 'border-white/5 opacity-60' : 'border-cyan-400/20 hover:bg-[#162032]'\}`\}>\
              <div className="flex items-start justify-between">\
                <div>\
                  <h3 className=\{`font-bold mb-1 $\{n.read ? 'text-white/70' : 'text-white'\}`\}>\{n.title\}</h3>\
                  <p className="text-white/50 text-sm\\">\{n.message\}</p>\
                </div>\
                \{!n.read && <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5" />\}\
              </div>\
              <p className="text-white/30 text-xs mt-3\\">\{formatDate(n.createdAt)\}</p>\
            </div>\
          ))\
        )\}\
      </div>\
    </div>\
  );\
\}}
