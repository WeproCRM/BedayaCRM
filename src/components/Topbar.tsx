import { useApp } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';
import { sanitizeKey } from '../utils';
import type { User, Notification, Chat } from '../types';

interface TopbarProps {
  user: User | null;
  notifications: Notification[];
  chats: Chat[];
}

export function Topbar({ user, notifications, chats }: TopbarProps) {
  const { setSidebarOpen, setPage } = useApp();
  const { isMobile } = useWindowSize();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const chatUnreadCount = user
    ? chats.reduce((sum, chat) => {
        const key = sanitizeKey(user.email);
        return sum + (chat.unreadBy?.[key] || 0);
      }, 0)
    : 0;

  return (
    <header className="flex items-center justify-between mb-6">
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white/70 hover:text-white p-2"
        >
          ☰
        </button>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage('notifications')}
          className="relative text-white/70 hover:text-white p-2"
        >
          🔔
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>

        <button
          onClick={() => setPage('chat')}
          className="relative text-white/70 hover:text-white p-2"
        >
          💬
          {chatUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {chatUnreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white font-medium text-sm">{user?.name || 'مجهول'}</p>
            <p className="text-white/50 text-xs">
              {user?.role === 'super-admin' ? 'مدير عام' : user?.role === 'admin' ? 'مدير' : 'موظف'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </header>
  );
}