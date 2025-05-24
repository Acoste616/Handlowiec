'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ClientUser {
  id: string;
  email: string;
  companyName: string;
  companyId: string;
  role: 'client_admin' | 'client_user';
  avatar?: string;
  permissions: string[];
  lastLogin: string;
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: 'pl' | 'en';
  };
}

interface ClientAuthContextType {
  user: ClientUser | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

// Test users
const testUsers: Record<string, { password: string; user: ClientUser }> = {
  'techflow@bezhandlowca.pl': {
    password: 'client2024',
    user: {
      id: 'client_1',
      email: 'techflow@bezhandlowca.pl',
      companyName: 'TechFlow Solutions',
      companyId: 'techflow_001',
      role: 'client_admin',
      avatar: undefined,
      permissions: ['view_leads', 'view_reports', 'manage_settings', 'view_team'],
      lastLogin: new Date().toISOString(),
      settings: {
        notifications: true,
        theme: 'light',
        language: 'pl'
      }
    }
  },
  'probiznes@bezhandlowca.pl': {
    password: 'client2024',
    user: {
      id: 'client_2',
      email: 'probiznes@bezhandlowca.pl',
      companyName: 'ProBiznes Sp. z o.o.',
      companyId: 'probiznes_002',
      role: 'client_admin',
      avatar: undefined,
      permissions: ['view_leads', 'view_reports', 'manage_settings', 'view_team'],
      lastLogin: new Date().toISOString(),
      settings: {
        notifications: true,
        theme: 'light',
        language: 'pl'
      }
    }
  }
};

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('client_user');
        const storedExpiry = localStorage.getItem('client_session_expiry');
        
        if (storedUser && storedExpiry) {
          const expiryDate = new Date(storedExpiry);
          const now = new Date();
          
          if (now < expiryDate) {
            setUser(JSON.parse(storedUser));
          } else {
            // Session expired
            localStorage.removeItem('client_user');
            localStorage.removeItem('client_session_expiry');
          }
        }
      } catch (error) {
        console.error('Error checking client auth:', error);
        localStorage.removeItem('client_user');
        localStorage.removeItem('client_session_expiry');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const testUser = testUsers[email];
      if (testUser && testUser.password === password) {
        const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day
        const expiryDate = new Date(Date.now() + sessionDuration);
        
        const userWithUpdatedLogin = {
          ...testUser.user,
          lastLogin: new Date().toISOString()
        };

        setUser(userWithUpdatedLogin);
        localStorage.setItem('client_user', JSON.stringify(userWithUpdatedLogin));
        localStorage.setItem('client_session_expiry', expiryDate.toISOString());
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('client_user');
    localStorage.removeItem('client_session_expiry');
  };

  const value: ClientAuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
} 