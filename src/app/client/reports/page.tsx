'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function ClientReportsPage() {
  const { user } = useClientAuth();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generowanie raportów...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Raporty i Analizy
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">ROI</div>
            <div className="text-2xl font-bold text-green-600">287%</div>
            <div className="text-xs text-gray-500">↗ +12% vs poprzedni okres</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Koszt per lead</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(245)}</div>
            <div className="text-xs text-gray-500">↘ -8% vs poprzedni okres</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Konwersja</div>
            <div className="text-2xl font-bold text-purple-600">24.2%</div>
            <div className="text-xs text-gray-500">↗ +3% vs poprzedni okres</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Średni deal</div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(78500)}</div>
            <div className="text-xs text-gray-500">↗ +15% vs poprzedni okres</div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Funnel */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lejek sprzedaży</h3>
            <div className="space-y-4">
              {[
                { stage: 'Leady', count: 186, percentage: 100, color: 'bg-blue-500' },
                { stage: 'Qualified', count: 124, percentage: 67, color: 'bg-green-500' },
                { stage: 'Propozycja', count: 67, percentage: 36, color: 'bg-yellow-500' },
                { stage: 'Zamknięte', count: 45, percentage: 24, color: 'bg-purple-500' }
              ].map((stage) => (
                <div key={stage.stage} className="flex items-center">
                  <div className="w-20 text-sm font-medium text-gray-700">{stage.stage}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-6">
                      <div
                        className={`${stage.color} h-6 rounded-full flex items-center justify-center text-white text-xs font-medium`}
                        style={{ width: `${stage.percentage}%` }}
                      >
                        {stage.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600">{stage.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skuteczność źródeł</h3>
            <div className="space-y-3">
              {[
                { source: 'LinkedIn', leads: 45, closed: 18, rate: 40 },
                { source: 'Google Ads', leads: 67, closed: 21, rate: 31 },
                { source: 'Strona www', leads: 34, closed: 8, rate: 24 },
                { source: 'Polecenia', leads: 40, closed: 12, rate: 30 }
              ].map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{source.leads} leadów</span>
                    <span>{source.closed} zamkniętych</span>
                    <span className="font-medium text-green-600">{source.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eksport raportów</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center">
              📄 Eksport PDF
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
              📊 Eksport Excel
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
              🖨️ Drukuj raport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 