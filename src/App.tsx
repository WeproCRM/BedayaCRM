import { Component, ErrorInfo, ReactNode } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { AddClientPage } from './pages/AddClientPage';
import { EditClientPage } from './pages/EditClientPage';
import { TasksPage } from './pages/TasksPage';
import { AddTaskPage } from './pages/AddTaskPage';
import { TeamPage } from './pages/TeamPage';
import { ChatPage } from './pages/ChatPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { AppProvider, useApp } from './context/AppContext';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-700 min-h-screen text-right dir-rtl" dir="rtl">
          <h2 className="text-2xl font-bold mb-2">حدث خطأ أثناء تحميل لوحة التحكم</h2>
          <p className="bg-white p-4 rounded border border-red-200 font-mono text-sm mb-4">{this.state.error}</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const { user, userData, isAdmin, loading } = useAuth();
  const { clients, tasks, users, notifications, chats, exchangeRates, isLoading } = useFirestore();
  const appContext = useApp() as any;
  const page = appContext?.page || 'dashboard';
  const setPage = appContext?.setPage || (() => {});

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#071120] text-white dir-rtl" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const currentUser = {
    id: user?.uid || '1',
    uid: user?.uid || '1',
    email: user?.email || '',
    name: userData?.name || user?.displayName || 'المستخدم',
    role: userData?.role || 'admin',
    ...userData,
  };

  return (
    <div className="flex h-screen bg-[#071120] text-white dir-rtl" dir="rtl">
      <Sidebar currentPage={page} setCurrentPage={setPage} page={page} setPage={setPage} />

      <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
        <Topbar user={currentUser} notifications={notifications} chats={chats} />

        <main className="flex-1 overflow-y-auto mt-2 bg-[#0b1422] rounded-2xl p-6 border border-white/5">
          {page === 'dashboard' && <DashboardPage clients={clients} exchangeRates={exchangeRates} />}
          {page === 'clients' && <ClientsPage clients={clients} isAdmin={isAdmin} currentUser={currentUser} />}
          {page === 'client-details' && appContext?.selectedClient && (
            <ClientDetailsPage client={appContext.selectedClient} tasks={tasks} isAdmin={isAdmin} />
          )}
          {page === 'add-client' && <AddClientPage />}
          {page === 'edit-client' && appContext?.editingClient && (
            <EditClientPage client={appContext.editingClient} />
          )}
          {page === 'tasks' && (
            <TasksPage tasks={tasks} clients={clients} users={users} currentUser={currentUser} isAdmin={isAdmin} />
          )}
          {page === 'add-task' && <AddTaskPage clients={clients} users={users} currentUser={currentUser} />}
          {page === 'team' && <TeamPage users={users} currentUser={currentUser} isAdmin={isAdmin} />}
          {(page === 'chat' || page === 'chat-room') && (
            <ChatPage chats={chats} users={users} currentUser={currentUser} />
          )}
          {page === 'notifications' && <NotificationsPage notifications={notifications} />}
          {page === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
