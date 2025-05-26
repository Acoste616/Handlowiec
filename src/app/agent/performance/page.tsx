'use client';

import { useState, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface PerformanceMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalValue: number;
  conversionRate: number;
  averageDealValue: number;
  responseTime: number;
  tasksCompleted: number;
  tasksOverdue: number;
  tasksCompletionRate: number;
}

interface DailyStats {
  date: string;
  newLeads: number;
  closedDeals: number;
  value: number;
}

interface LeadSource {
  source: string;
  count: number;
  value: number;
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock metrics
      const mockMetrics: PerformanceMetrics = {
        totalLeads: 156,
        newLeads: 23,
        qualifiedLeads: 45,
        closedDeals: 12,
        totalValue: 450000,
        conversionRate: 26.7,
        averageDealValue: 37500,
        responseTime: 2.5,
        tasksCompleted: 89,
        tasksOverdue: 3,
        tasksCompletionRate: 96.7
      };

      // Mock daily stats
      const mockDailyStats: DailyStats[] = Array.from({ length: 7 }, (_, i) => ({
        date: subDays(new Date(), i).toISOString(),
        newLeads: Math.floor(Math.random() * 5) + 1,
        closedDeals: Math.floor(Math.random() * 3),
        value: Math.floor(Math.random() * 50000) + 10000
      }));

      // Mock lead sources
      const mockLeadSources: LeadSource[] = [
        { source: 'Strona WWW', count: 45, value: 180000 },
        { source: 'Referencje', count: 32, value: 140000 },
        { source: 'Cold Call', count: 28, value: 85000 },
        { source: 'Eventy', count: 15, value: 45000 }
      ];

      setMetrics(mockMetrics);
      setDailyStats(mockDailyStats);
      setLeadSources(mockLeadSources);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Błąd podczas ładowania danych o wynikach');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie wyników...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">📊 Wyniki</h1>
              <p className="text-sm text-gray-500">
                Analiza Twoich wyników i efektywności
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="week">Ostatni tydzień</option>
                <option value="month">Ostatni miesiąc</option>
                <option value="quarter">Ostatni kwartał</option>
              </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Łączna wartość</h3>
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0
              }).format(metrics.totalValue)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {metrics.closedDeals} zamkniętych transakcji
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Nowe leady</h3>
            <p className="text-2xl font-bold text-gray-900">{metrics.newLeads}</p>
            <p className="text-sm text-gray-500 mt-2">
              {metrics.qualifiedLeads} zakwalifikowanych
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Wskaźnik konwersji</h3>
            <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">
              Średnia wartość: {new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0
              }).format(metrics.averageDealValue)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Efektywność zadań</h3>
            <p className="text-2xl font-bold text-gray-900">{metrics.tasksCompletionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">
              {metrics.tasksCompleted} wykonanych, {metrics.tasksOverdue} przeterminowanych
            </p>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aktywność dzienna</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nowe leady
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zamknięte transakcje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyStats.map((stat) => (
                  <tr key={stat.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(stat.date), 'd MMMM yyyy', { locale: pl })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.newLeads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.closedDeals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN',
                        maximumFractionDigits: 0
                      }).format(stat.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Źródła leadów</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Źródło
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liczba leadów
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Średnia wartość
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadSources.map((source) => (
                  <tr key={source.source}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {source.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {source.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN',
                        maximumFractionDigits: 0
                      }).format(source.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN',
                        maximumFractionDigits: 0
                      }).format(source.value / source.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 