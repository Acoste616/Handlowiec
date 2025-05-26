'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface SystemStats {
  totalClients: number;
  totalLeads: number;
  totalAgents: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeClients: number;
  newLeadsToday: number;
  conversionRate: number;
}

interface Client {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'trial';
  leadsCount: number;
  agentsCount: number;
  monthlyRevenue: number;
  lastActivity: string;
  createdAt: string;
}

interface RecentActivity {
  id: string;
  type: 'new_client' | 'new_lead' | 'deal_closed' | 'system_alert';
  description: string;
  clientName?: string;
  timestamp: string;
  value?: number;
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'clients' | 'leads' | 'analytics'>('overview');

  // Sprawdzenie autoryzacji - tylko dla super admina
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const SUPER_ADMIN_PASSWORD = 'bezhandlowca2024super';

  useEffect(() => {
    // Sprawdź czy użytkownik jest już zalogowany
    const savedAuth = localStorage.getItem('super_admin_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.expiry > Date.now()) {
        setIsAuthorized(true);
        setShowLogin(false);
        fetchData();
      } else {
        localStorage.removeItem('super_admin_auth');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SUPER_ADMIN_PASSWORD) {
      const authData = {
        authorized: true,
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 godziny
      };
      localStorage.setItem('super_admin_auth', JSON.stringify(authData));
      setIsAuthorized(true);
      setShowLogin(false);
      fetchData();
    } else {
      setError('Nieprawidłowe hasło');
    }
  };

  const fetchData = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: SystemStats = {
        totalClients: 12,
        totalLeads: 1847,
        totalAgents: 28,
        totalRevenue: 485000,
        monthlyGrowth: 23.5,
        activeClients: 11,
        newLeadsToday: 47,
        conversionRate: 8.2
      };

      const mockClients: Client[] = [
        {
          id: '1',
          name: 'TechFlow Solutions',
          domain: 'techflow.pl',
          plan: 'enterprise',
          status: 'active',
          leadsCount: 156,
          agentsCount: 4,
          monthlyRevenue: 45000,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'ProBiznes Sp. z o.o.',
          domain: 'probiznes.com',
          plan: 'pro',
          status: 'active',
          leadsCount: 89,
          agentsCount: 2,
          monthlyRevenue: 28000,
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'StartupXYZ',
          domain: 'startupxyz.io',
          plan: 'basic',
          status: 'trial',
          leadsCount: 23,
          agentsCount: 1,
          monthlyRevenue: 0,
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'deal_closed',
          description: 'Deal zamknięty',
          clientName: 'TechFlow Solutions',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          value: 85000
        },
        {
          id: '2',
          type: 'new_client',
          description: 'Nowy klient dołączył do platformy',
          clientName: 'StartupXYZ',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'new_lead',
          description: 'Nowe leady z kampanii Google Ads',
          clientName: 'ProBiznes Sp. z o.o.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setStats(mockStats);
      setClients(mockClients);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Błąd podczas ładowania danych');
    } finally {
      setIsLoading(false);
    }
  };

  const getClientStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: Client['plan']) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'new_client': return '🏢';
      case 'new_lead': return '🎯';
      case 'deal_closed': return '💰';
      case 'system_alert': return '⚠️';
      default: return '📋';
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Panel</h1>
            <p className="text-gray-600">Wprowadź hasło dostępu</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Wprowadź hasło super admina"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu administratora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-red-600">🔥 Super Admin Panel</h1>
              <p className="text-sm text-gray-500">
                Pełny dostęp do systemu BezHandlowca.pl
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {format(new Date(), 'EEEE, d MMMM yyyy', { locale: pl })}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('super_admin_auth');
                  setShowLogin(true);
                  setIsAuthorized(false);
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Przegląd', icon: '📊' },
              { id: 'campaigns', label: 'Kampanie AI', icon: '🚀', isLink: true, href: '/super-admin/campaigns' },
              { id: 'automation', label: 'Automatyzacja', icon: '🤖', isLink: true, href: '/super-admin/automation' },
              { id: 'form-leads', label: 'Leady z formularza', icon: '🎯', isLink: true, href: '/super-admin/leads' },
              { id: 'clients', label: 'Klienci', icon: '🏢' },
              { id: 'leads', label: 'Wszystkie Leady', icon: '📋' },
              { id: 'analytics', label: 'Analityka', icon: '📈' }
            ].map((tab) => (
              tab.isLink ? (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                >
                  {tab.icon} {tab.label}
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedView === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              )
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {selectedView === 'overview' && stats && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-4">🏢</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Klienci</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                    <p className="text-sm text-green-600">{stats.activeClients} aktywnych</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">🎯</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Leady</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                    <p className="text-sm text-blue-600">+{stats.newLeadsToday} dziś</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-500 mr-4">👥</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Handlowcy</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
                    <p className="text-sm text-gray-600">Aktywni agenci</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-orange-500 mr-4">💰</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Przychód</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} zł</p>
                    <p className="text-sm text-green-600">+{stats.monthlyGrowth}% MoM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ostatnia aktywność</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        {activity.clientName && (
                          <p className="text-sm text-gray-600">{activity.clientName}</p>
                        )}
                        {activity.value && (
                          <p className="text-sm font-medium text-green-600">
                            {activity.value.toLocaleString()} zł
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.timestamp), 'HH:mm, d MMM', { locale: pl })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
                <div className="space-y-3">
                  <Link
                    href="/super-admin/clients/new"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                  >
                    🏢 Dodaj nowego klienta
                  </Link>
                  <Link
                    href="/super-admin/leads"
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                  >
                    🎯 Zarządzaj leadami
                  </Link>
                  <Link
                    href="/super-admin/reports"
                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center"
                  >
                    📊 Generuj raporty
                  </Link>
                  <Link
                    href="/super-admin/settings"
                    className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 text-sm flex items-center justify-center"
                  >
                    ⚙️ Ustawienia systemu
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Clients Tab */}
        {selectedView === 'clients' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Wszyscy klienci</h3>
                <Link
                  href="/super-admin/clients/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Dodaj klienta
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leady
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Przychód
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.domain}</div>
                          <div className="text-xs text-gray-400">
                            Utworzony: {format(new Date(client.createdAt), 'd MMM yyyy', { locale: pl })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(client.plan)}`}>
                          {client.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClientStatusColor(client.status)}`}>
                          {client.status === 'active' ? 'Aktywny' : 
                           client.status === 'inactive' ? 'Nieaktywny' : 'Trial'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.leadsCount}
                        <div className="text-xs text-gray-500">{client.agentsCount} agentów</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.monthlyRevenue.toLocaleString()} zł/mies
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/super-admin/clients/${client.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Zobacz
                          </Link>
                          <Link
                            href={`/super-admin/clients/${client.id}/leads`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Leady
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {selectedView === 'leads' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wszystkie leady w systemie</h3>
            <p className="text-gray-600">Funkcja zarządzania wszystkimi leadami będzie dostępna wkrótce.</p>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zaawansowana analityka</h3>
            <p className="text-gray-600">Szczegółowe raporty i analityka będą dostępne wkrótce.</p>
          </div>
        )}
      </div>
    </div>
  );
} 