// src/App.tsx (تحديث)
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { TasksPage } from './pages/TasksPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ChatPage } from './pages/ChatPage';

export function App() {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) return <div className="min-h-screen bg-[#0b1422] flex items-center justify-center text-white">جاري التحميل...</div>;
  if (!isAuthenticated) return <LoginPage />;

  return (
    <div className="flex h-screen bg-[#0b1422] overflow-hidden dir-rtl">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'clients' && hasPermission('clients.view') && <ClientsPage />}
          {currentPage === 'tasks' && hasPermission('tasks.view') && <TasksPage />}
          {currentPage === 'notifications' && <NotificationsPage />}
          {currentPage === 'chat' && <ChatPage />}
          {currentPage === 'settings' && hasPermission('settings.manage') && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
