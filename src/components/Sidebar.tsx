import React from 'react';
import { LayoutDashboard, Users, CheckSquare, Bell, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export interface SidebarProps {
  [key: string]: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ page, setPage, currentPage, setCurrentPage }) => {
  const { hasPermission } = useAuth();
  const currentTab = page || currentPage;
  const changeTab = setPage || setCurrentPage;

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, perm: null },
    { id: 'clients', label: 'العملاء', icon: Users, perm: 'clients.view' },
    { id: 'tasks', label: 'المهام', icon: CheckSquare, perm: 'tasks.view' },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, perm: null },
    { id: 'chat', label: 'المحادثات', icon: MessageSquare, perm: null },
    { id: 'settings', label: 'الإعدادات', icon: Settings, perm: 'settings.manage' },
  ];

  return (
    <aside className="w-64 bg-[#111c2d] border-l border-white/10 flex flex-col h-screen">
      <div className="p-5 border-b border-white/10 font-bold text-xl text-cyan-400 flex items-center gap-2">
        BedayaCRM
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          if (item.perm && !hasPermission(item.perm as any)) return null;
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                active 
                  ? 'bg-cyan-500 text-black font-semibold' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};