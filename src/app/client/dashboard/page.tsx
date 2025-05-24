'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { clientApiClient } from '@/utils/clientApi';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface DashboardStats {
  activeAgents: number;
  leadsToday: number;
  leadsWeek: number;
  leadsMonth: number;
  pipelineValue: number;
  conversionRate: number;
  avgResponseTime: number;
  upcomingCalls: number;
  trendsData: { date: string; count: number }[];
}

interface Activity {
  id: string;
  timestamp: string;
  type: 'call_started' | 'new_lead' | 'deal_closed' | 'email_sent';
  agentName: string;
  agentAvatar?: string;
  description: string;
  leadName?: string;
  companyName?: string;
  value?: number;
  status: 'success' | 'info' | 'warning';
}

interface TopPerformer {
  id: string;
  name: string;
  avatar?: string;
  leadsThisMonth: number;
  closingRate: number;
  totalValue: number;
  trend: 'up' | 'down' | 'stable';
}

interface Alert {
  id: string;
  type: 'overdue' | 'follow_up' | 'high_value';
  title: string;
  description: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

export default function ClientDashboardPage() {
  const { user } = useClientAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock stats data
      const mockStats: DashboardStats = {
        activeAgents: 3,
        leadsToday: 12,
        leadsWeek: 47,
        leadsMonth: 186,
        pipelineValue: 1250000,
        conversionRate: 23.5,
        avgResponseTime: 8.5,
        upcomingCalls: 6,
        trendsData: [
          { date: '01.12', count: 8 },
          { date: '02.12', count: 12 },
          { date: '03.12', count: 15 },
          { date: '04.12', count: 9 },
          { date: '05.12', count: 11 },
          { date: '06.12', count: 14 },
          { date: '07.12', count: 12 }
        ]
      };

      const mockActivities: Activity[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          type: 'call_started',
          agentName: 'Bartek Nowak',
          description: 'rozpoczął rozmowę z Kowalski Sp. z o.o.',
          leadName: 'Jan Kowalski',
          companyName: 'Kowalski Sp. z o.o.',
          status: 'info'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          type: 'new_lead',
          agentName: 'Marta Kowalska',
          description: 'Nowy lead przypisany',
          leadName: 'Anna Nowak',
          companyName: 'TechCorp',
          status: 'success'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          type: 'deal_closed',
          agentName: 'Tomasz Wiśniewski',
          description: 'zamknął deal',
          companyName: 'ProSoft',
          value: 50000,
          status: 'success'
        }
      ];

      const mockTopPerformers: TopPerformer[] = [
        {
          id: '1',
          name: 'Marta Kowalska',
          leadsThisMonth: 42,
          closingRate: 28.5,
          totalValue: 380000,
          trend: 'up'
        },
        {
          id: '2',
          name: 'Bartek Nowak',
          leadsThisMonth: 38,
          closingRate: 24.2,
          totalValue: 320000,
          trend: 'up'
        },
        {
          id: '3',
          name: 'Tomasz Wiśniewski',
          leadsThisMonth: 35,
          closingRate: 21.1,
          totalValue: 285000,
          trend: 'stable'
        }
      ];

      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'overdue',
          title: 'Leady bez kontaktu',
          description: 'Leady oczekujące na kontakt > 24h',
          count: 3,
          priority: 'high',
          action: 'Sprawdź leady'
        },
        {
          id: '2',
          type: 'follow_up',
          title: 'Follow-up na dziś',
          description: 'Zaplanowane na dzisiaj',
          count: 8,
          priority: 'medium',
          action: 'Zobacz kalendarz'
        },
        {
          id: '3',
          type: 'high_value',
          title: 'Wysokowartościowe leady',
          description: 'Wymagają uwagi klienta',
          count: 2,
          priority: 'high',
          action: 'Przejrzyj'
        }
      ];

      setStats(mockStats);
      setActivities(mockActivities);
      setTopPerformers(mockTopPerformers);
      setAlerts(mockAlerts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Błąd podczas pobierania danych dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call_started': return '📞';
      case 'new_lead': return '🎯';
      case 'deal_closed': return '💰';
      case 'email_sent': return '✉️';
      default: return '📋';
    }
  };

  const getAlertColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard - {user?.companyName}
              </h1>
              <p className="text-sm text-gray-500">
                Ostatnia aktualizacja: {format(new Date(), 'HH:mm', { locale: pl })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </div>
            </div>
          </div>
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

        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Aktywni handlowcy</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAgents}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Leady dziś</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.leadsToday}</p>
                  <p className="text-xs text-gray-500">Tydzień: {stats.leadsWeek}</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pipeline Value</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.pipelineValue)}</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Konwersja</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</p>
                  <p className="text-xs text-gray-500">Śr. czas: {stats.avgResponseTime}min</p>
                </div>
                <div className="text-3xl">📈</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Co się dzieje teraz</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Na żywo
                </div>
              </div>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.agentName} {activity.description}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(activity.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      {activity.leadName && (
                        <p className="text-sm text-gray-600">
                          {activity.leadName} - {activity.companyName}
                          {activity.value && (
                            <span className="ml-2 font-medium text-green-600">
                              {formatCurrency(activity.value)}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="text-center py-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Zobacz więcej aktywności
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerty</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs opacity-75">{alert.description}</p>
                      </div>
                      <span className="font-bold text-lg">{alert.count}</span>
                    </div>
                    {alert.action && (
                      <button className="mt-2 text-xs font-medium underline hover:no-underline">
                        {alert.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Handlowcy</h3>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {performer.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {performer.name}
                        </p>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">#{index + 1}</span>
                          {performer.trend === 'up' && (
                            <span className="text-green-500">↗</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{performer.leadsThisMonth} leadów</span>
                        <span>{performer.closingRate}% konwersja</span>
                      </div>
                      <p className="text-xs font-medium text-green-600">
                        {formatCurrency(performer.totalValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm">
                  📞 Sprawdź aktywne rozmowy
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                  📊 Wygeneruj raport dzienny
                </button>
                <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                  💬 Skontaktuj się z zespołem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {stats && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend leadów (ostatnie 7 dni)</h3>
            <div className="space-y-2">
              {stats.trendsData.map((day) => {
                const maxCount = Math.max(...stats.trendsData.map(d => d.count));
                const width = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={day.date} className="flex items-center">
                    <div className="w-12 text-xs text-gray-600">{day.date}</div>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-primary-600 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${width}%` }}
                        >
                          {day.count > 0 && (
                            <span className="text-white text-xs font-medium">{day.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 