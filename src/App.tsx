import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { Page } from './types';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { userData, isAdmin } = useAuth();

  // بيانات افتراضية لتفادي أخطاء الأنواع أثناء البناء
  const currentUser = userData || { id: '1', uid: '1', email: '', role: 'employee' as const };
  const notifications: any[] = [];
  const chats: any[] = [];
  const clients: any[] = [];
  const tasks: any[] = [];
  const users: any[] = [];
  const exchangeRates = { USD: 1, EUR: 0.92, SAR: 3.75 };

  return (
    <div className="flex h-screen bg-gray-50 dir-rtl" dir="rtl">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={currentUser} notifications={notifications} chats={chats} />
        <main className="flex-1 overflow-y-auto p-6">
          {currentPage === 'dashboard' && (
            <DashboardPage clients={clients} exchangeRates={exchangeRates} />
          )}
          {currentPage === 'clients' && (
            <ClientsPage clients={clients} isAdmin={isAdmin} currentUser={currentUser} />
          )}
          {currentPage === 'tasks' && (
            <TasksPage tasks={tasks} clients={clients} users={users} currentUser={currentUser} isAdmin={isAdmin} />
          )}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'notifications' && <NotificationsPage notifications={notifications} />}
        </main>
      </div>
    </div>
  );
}