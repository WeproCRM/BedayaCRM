import { updateDocument } from '../services/firestore';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import { Bell, CheckCheck } from 'lucide-react';
import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
}

export function NotificationsPage({ notifications }: Props) {
  const { setPage } = useApp();

  const handleMarkRead = async (n: Notification) => {
    if (!n.read) {
      await updateDocument('notifications', n.id, { read: true, readAt: new Date().toISOString() });
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => updateDocument('notifications', n.id, { read: true, readAt: new Date().toISOString() })));
  };

  const handleOpen = async (n: Notification) => {
    await handleMarkRead(n);
    const routeMap: Record<string, string> = { '/tasks': 'tasks', '/clients': 'clients', '/team': 'team', '/chat': 'chat', '/notifications': 'notifications' };
    setPage((routeMap[n.link || ''] || 'dashboard') as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="text-cyan-400" size={24} />
          <h1 className="text-white text-2xl font-bold">الإشعارات</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button onClick={handleMarkAllRead}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2 transition-colors">
            <CheckCheck size={16} />
            تعيين الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-[#111c2d] rounded-2xl border border-white/5">
            <Bell className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/50 text-lg">لا توجد إشعارات</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} onClick={() => handleOpen(n)}
              className={`bg-[#111c2d] rounded-2xl p-5 border cursor-pointer transition-all hover:bg-[#162032] ${
                n.read ? 'border-white/5 opacity-60' : 'border-cyan-400/20'
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${n.read ? 'text-white/70' : 'text-white'}`}>{n.title || 'إشعار'}</h3>
                  <p className="text-white/50 text-sm">{n.message}</p>
                </div>
                {!n.read && <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5 animate-pulse" />}
              </div>
              <p className="text-white/30 text-xs mt-3">{formatDate(n.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
