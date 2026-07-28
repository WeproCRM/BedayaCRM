import { useApp } from '../context/AppContext';
import type { Page } from '../types';

const menuItems: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
  { id: 'clients', label: 'العملاء', icon: '👥' },
  { id: 'tasks', label: 'المهام', icon: '✅' },
  { id: 'team', label: 'الفريق', icon: '🏢' },
  { id: 'chat', label: 'الدردشة', icon: '💬' },
  { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
];

export function Sidebar() {
  const { page, setPage, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-[#0f172a] border-l border-white/5 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-cyan-400 text-xl font-bold mb-8">BedayaCRM</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right ${
                  page === item.id
                    ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}