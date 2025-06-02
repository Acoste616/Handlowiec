'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useClientAuth } from '@/hooks/useClientAuth';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/client/dashboard', icon: '📊' },
  { name: 'Leady', href: '/client/leads', icon: '🎯' },
  { name: 'Zespół', href: '/client/team', icon: '👥' },
  { name: 'Raporty', href: '/client/reports', icon: '📈' },
  { name: 'Wiadomości', href: '/client/messages', icon: '💬' },
  { name: 'Ustawienia', href: '/client/settings', icon: '⚙️' },
];

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout, isAuthenticated } = useClientAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      try {
        router.push('/client/login');
      } catch (error) {
        console.error('Error redirecting to login:', error);
        // Fallback redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/client/login';
        }
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu klienta...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-16'} 
          transition-all duration-300 ease-in-out flex-shrink-0
          lg:relative fixed inset-y-0 left-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              {isSidebarOpen && (
                <Link href="/client/dashboard" className="flex items-center">
                  <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">BH</span>
                  </div>
                  <span className="font-semibold text-gray-900">Panel Klienta</span>
                </Link>
              )}
              {!isSidebarOpen && (
                <div className="flex justify-center w-full">
                  <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">BH</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Company Info */}
            {isSidebarOpen && (
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold">
                      {user.companyName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{user.companyName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={!isSidebarOpen ? item.name : undefined}
                  >
                    <span className={`text-lg ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                    {isSidebarOpen && item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              {isSidebarOpen && (
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Ostatnie logowanie:</span>
                  <span>{new Date(user.lastLogin).toLocaleDateString('pl-PL')}</span>
                </div>
              )}
              
              <button
                onClick={logout}
                className={`w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                  !isSidebarOpen ? 'justify-center' : ''
                }`}
                title={!isSidebarOpen ? 'Wyloguj się' : undefined}
              >
                <svg className={`w-4 h-4 ${isSidebarOpen ? 'mr-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                {isSidebarOpen && 'Wyloguj się'}
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar with sidebar toggle */}
          <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title={isSidebarOpen ? 'Zwiń sidebar' : 'Rozwiń sidebar'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1 flex items-center justify-center lg:justify-start lg:ml-4">
              <h1 className="font-medium text-gray-900">{user.companyName}</h1>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 