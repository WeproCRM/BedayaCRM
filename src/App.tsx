import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { Page } from './types';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { user, userData, isAdmin, loading } = useAuth();

  // 1. حالة التحميل
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dir-rtl" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // 2. إذا لم يقم المستخدم بتسجيل الدخول
  if (!user) {
    return <LoginPage />;
  }

  // 3. تجهيز بيانات المستخدم مع قيم افتراضية آمنة تمنع أخطاء الـ null / undefined
  const currentUser = {
    id: user?.uid || '1',
    uid: user?.uid || '1',
    email: user?.email || userData?.email || '',
    name: userData?.name || user?.displayName || 'مستخدم',
    displayName: userData?.displayName || user?.displayName || 'مستخدم',
    role: userData?.role || 'admin',
    ...userData,
  };

  const notifications: any[] = [];
  const chats: any[] = [];
  const clients: any[] = [];
  const tasks: any[] = [];
  const users: any[] = [];
  const exchangeRates = { USD: 1, EUR: 0.92, SAR: 3.75 };

  return (
    <div className="flex h-screen bg-gray-50 dir-rtl" dir="rtl">
      {/* @ts-ignore */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        activeTab={currentPage}
        setActiveTab={setCurrentPage}
        onTabChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* @ts-ignore */}
        <Topbar 
          user={currentUser} 
          notifications={notifications} 
          chats={chats} 
        />
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