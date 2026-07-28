import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Page, Client } from '../types';

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  editingClient: Client | null;
  setEditingClient: (client: Client | null) => void;
  navigateToClientDetails: (client: Client) => void;
  navigateToEditClient: (client: Client) => void;
  navigateToAddClient: () => void;
  navigateBackToClients: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const navigateToClientDetails = useCallback((client: Client) => {
    setSelectedClient(client);
    setPage('client-details');
  }, []);

  const navigateToEditClient = useCallback((client: Client) => {
    setEditingClient(client);
    setPage('edit-client');
  }, []);

  const navigateToAddClient = useCallback(() => {
    setEditingClient(null);
    setPage('add-client');
  }, []);

  const navigateBackToClients = useCallback(() => {
    setSelectedClient(null);
    setEditingClient(null);
    setPage('clients');
  }, []);

  const value = useMemo(
    () => ({
      page,
      setPage,
      sidebarOpen,
      setSidebarOpen,
      selectedClient,
      setSelectedClient,
      editingClient,
      setEditingClient,
      navigateToClientDetails,
      navigateToEditClient,
      navigateToAddClient,
      navigateBackToClients,
    }),
    [page, sidebarOpen, selectedClient, editingClient, navigateToClientDetails, navigateToEditClient, navigateToAddClient, navigateBackToClients]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}