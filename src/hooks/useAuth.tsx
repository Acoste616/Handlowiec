'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validCredentials = [
  { 
    id: '1',
    email: 'admin@bezhandlowca.pl', 
    password: 'bezhandlowca2024',
    name: 'Administrator',
    role: 'admin' as const
  },
  { 
    id: '2',
    email: 'bartek@bezhandlowca.pl', 
    password: 'bezhandlowca2024',
    name: 'Bartek Nowak',
    role: 'user' as const
  },
  { 
    id: '3',
    email: 'marta@bezhandlowca.pl', 
    password: 'bezhandlowca2024',
    name: 'Marta Kowalska',
    role: 'user' as const
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany przy starcie
    const auth = localStorage.getItem('bezhandlowca_auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        if (authData.user && authData.expiry > Date.now()) {
          setUser(authData.user);
        } else {
          localStorage.removeItem('bezhandlowca_auth');
        }
      } catch (error) {
        localStorage.removeItem('bezhandlowca_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 useAuth.login called with:', email);
    console.log('🔑 Available credentials:', validCredentials.map(c => c.email));
    
    const credential = validCredentials.find(cred => 
      cred.email === email && cred.password === password
    );

    console.log('🔍 Found credential:', !!credential);
    console.log('📋 Credential details:', credential ? { email: credential.email, name: credential.name, role: credential.role } : 'None');

    if (credential) {
      const user: User = {
        id: credential.id,
        name: credential.name,
        email: credential.email,
        role: credential.role
      };

      const authData = {
        user,
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 godziny
      };

      console.log('💾 Saving to localStorage:', authData);
      localStorage.setItem('bezhandlowca_auth', JSON.stringify(authData));
      setUser(user);
      console.log('✅ User set successfully');
      return true;
    }

    console.log('❌ No matching credential found');
    return false;
  };

  const logout = () => {
    localStorage.removeItem('bezhandlowca_auth');
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 