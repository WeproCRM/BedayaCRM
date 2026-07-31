import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { useWindowSize } from './hooks/useWindowSize';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoadingSpinner } from './components/LoadingSpinner';

import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { AddClientPage } from './pages/AddClientPage';
import { EditClientPage } from './pages/EditClientPage';
import { TasksPage } from './pages/TasksPage';
import { TeamPage } from './pages/TeamPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ChatPage } from './pages/ChatPage';

function AppContent() {
  const { user, userData, isLoading: authLoading } = useAuth();
  const { clients, tasks, notifications, chats, exchangeRates, isLoading: dataLoading } = useFirestore();
  const { page, selectedClient, editingClient } = useApp();
  const { isDesktop } = useWindowSize();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const visibleNotifications = notifications.filter((n) => {
    if (!userData?.email) return false;
    if (!n.recipientEmail) return true;
    return n.recipientEmail === userData.email;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {isDesktop && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={userData as any} notifications={visibleNotifications as any} />
        <main className="flex-1 overflow-y-auto p-4">
          {dataLoading && page === 'dashboard' ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {page === 'dashboard' && <DashboardPage clients={clients} tasks={tasks} exchangeRates={exchangeRates} />}
              {page === 'clients' && <ClientsPage clients={clients} />}
              {page === 'add-client' && <AddClientPage />}
              {page === 'edit-client' && editingClient && <EditClientPage client={editingClient as any} />}
              {page === 'client-details' && selectedClient && (
                <ClientDetailsPage client={selectedClient as any} tasks={tasks} />
              )}
              {page === 'tasks' && <TasksPage tasks={tasks} />}
              {page === 'team' && <TeamPage />}
              {page === 'notifications' && <NotificationsPage notifications={visibleNotifications as any} />}
              {page === 'chat' && <ChatPage chats={chats as any} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
