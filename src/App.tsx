import { Component, ErrorInfo, ReactNode } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { useAuth } from './hooks/useAuth';
import { AppProvider, useApp } from './context/AppContext';

// مكوّن الحماية لمنع كراش التطبيق
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
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
          >
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
  
  // الحصول على الصفحة الحالية والبيانات الحقيقية مباشرة من AppContext
  const appContext = useApp() as any;
  const page = appContext?.page || 'dashboard';
  const setPage = appContext?.setPage || (() => {});

  if (loading) {
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

  const clients = appContext?.clients || [];
  const tasks = appContext?.tasks || [];
  const users = appContext?.users || [];
  const notifications = appContext?.notifications || [];
  const chats = appContext?.chats || [];
  const exchangeRates = appContext?.exchangeRates || { USD: 1, EUR: 0.92, SAR: 3.75 };

  return (
    <div className="flex h-screen bg-[#071120] text-white dir-rtl" dir="rtl">
      {/* القائمة الجانبية تمرر القيمة والدالة بالاسمين لضمان المطابقة */}
      <Sidebar 
        currentPage={page} 
        setCurrentPage={setPage}
        page={page}
        setPage={setPage} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
        {/* الشريط العلوي مطابق 100% لـ TopbarProps */}
        <Topbar 
          user={currentUser} 
          notifications={notifications} 
          chats={chats} 
        />

        <main className="flex-1 overflow-y-auto mt-2 bg-[#0b1422] rounded-2xl p-6 border border-white/5">
          {page === 'dashboard' && (
            <DashboardPage clients={clients} exchangeRates={exchangeRates} {...appContext} />
          )}
          {page === 'clients' && (
            <ClientsPage clients={clients} isAdmin={isAdmin} currentUser={currentUser} {...appContext} />
          )}
          {page === 'tasks' && (
            <TasksPage tasks={tasks} clients={clients} users={users} currentUser={currentUser} isAdmin={isAdmin} {...appContext} />
          )}
          {page === 'settings' && <SettingsPage {...appContext} />}
          {page === 'notifications' && (
            <NotificationsPage notifications={notifications} {...appContext} />
          )}
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