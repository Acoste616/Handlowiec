'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { clientApiClient } from '@/utils/clientApi';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalValue: number;
  conversionRate: number;
  avgDealSize: number;
  pendingOffers: number;
  weeklyProgress: {
    date: string;
    leads: number;
    qualified: number;
    offers: number;
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    agentName: string;
    timestamp: string;
  }[];
  salesFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export default function ClientDashboard() {
  const { user } = useClientAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const quickActions: QuickAction[] = [
    {
      title: 'Moje Leady',
      description: 'Zobacz postępy w sprzedaży',
      icon: '👥',
      href: '/client/leads',
      color: 'bg-blue-500'
    },
    {
      title: 'Oferty do Akceptacji',
      description: 'Sprawdź gotowe propozycje',
      icon: '📋',
      href: '/client/offers',
      color: 'bg-green-500'
    },
    {
      title: 'Lejek Sprzedaży',
      description: 'Analiza konwersji',
      icon: '📊',
      href: '/client/funnel',
      color: 'bg-purple-500'
    },
    {
      title: 'Kontakt z Zespołem',
      description: 'Skontaktuj się z handlowcem',
      icon: '💬',
      href: '/client/contact',
      color: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await clientApiClient.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Błąd podczas ładowania danych');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Błąd podczas ładowania danych';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie dashboardu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd ładowania</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel Klienta
              </h1>
              <p className="text-sm text-gray-500">
                Witaj, {user?.companyName} - {format(new Date(), 'EEEE, d MMMM yyyy', { locale: pl })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Ostatnie 7 dni</option>
                <option value="30d">Ostatnie 30 dni</option>
                <option value="90d">Ostatnie 90 dni</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Szybkie działania</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${action.color} text-white p-3 rounded-lg text-2xl mr-4`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-4">👥</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Łączne leady</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                    <p className="text-sm text-green-600">{stats.activeLeads} aktywnych</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">✅</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualified</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
                    <p className="text-sm text-blue-600">
                      {stats.totalLeads > 0 ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1) : '0'}% ratio
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-500 mr-4">💰</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Zamknięte deale</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.closedDeals}</p>
                    <p className="text-sm text-green-600">{stats.totalValue.toLocaleString()} zł</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-orange-500 mr-4">📋</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Oferty do akceptacji</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingOffers}</p>
                    <p className="text-sm text-blue-600">Wymagają Twojej decyzji</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Weekly Progress Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Postęp tygodniowy</h3>
                <div className="space-y-4">
                  {stats.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{format(new Date(day.date), 'EEE, d MMM', { locale: pl })}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm">{day.leads} leadów</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">{day.qualified} qualified</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-sm">{day.offers} ofert</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ostatnie aktywności</h3>
                <div className="space-y-4">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {activity.type === 'call' && '📞'}
                          {activity.type === 'email' && '📧'}
                          {activity.type === 'meeting' && '🤝'}
                          {activity.type === 'note' && '📝'}
                          {activity.type === 'offer' && '📋'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Agent: {activity.agentName}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{format(new Date(activity.timestamp), 'HH:mm, d MMM', { locale: pl })}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href="/client/activities"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Zobacz wszystkie aktywności →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lejek sprzedaży</h3>
              <div className="space-y-4">
                {stats.salesFunnel.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {stage.stage === 'Nowe leady' && '🎯'}
                        {stage.stage === 'Kontakt' && '📞'}
                        {stage.stage === 'Qualified' && '✅'}
                        {stage.stage === 'Propozycja' && '📋'}
                        {stage.stage === 'Zamknięte' && '🎉'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                        <p className="text-sm text-gray-600">{stage.count} leadów</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{stage.percentage}%</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 