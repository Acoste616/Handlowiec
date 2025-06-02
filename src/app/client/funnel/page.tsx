'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
  description: string;
}

interface FunnelStats {
  totalLeads: number;
  conversionRate: number;
  avgTimeToClose: number;
  stages: FunnelStage[];
}

export default function ClientFunnelPage() {
  const { user } = useClientAuth();
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: FunnelStats = {
        totalLeads: 156,
        conversionRate: 7.7,
        avgTimeToClose: 45,
        stages: [
          {
            id: '1',
            name: 'Nowe leady',
            count: 45,
            percentage: 100,
            color: 'bg-blue-500',
            icon: '🎯',
            description: 'Świeże leady z różnych źródeł'
          },
          {
            id: '2',
            name: 'Pierwszy kontakt',
            count: 32,
            percentage: 71,
            color: 'bg-green-500',
            icon: '📞',
            description: 'Nawiązano pierwszy kontakt'
          },
          {
            id: '3',
            name: 'Qualified',
            count: 18,
            percentage: 40,
            color: 'bg-yellow-500',
            icon: '✅',
            description: 'Zweryfikowane potrzeby i budżet'
          },
          {
            id: '4',
            name: 'Propozycja',
            count: 8,
            percentage: 18,
            color: 'bg-purple-500',
            icon: '📋',
            description: 'Przygotowana oferta handlowa'
          },
          {
            id: '5',
            name: 'Negocjacje',
            count: 5,
            percentage: 11,
            color: 'bg-orange-500',
            icon: '🤝',
            description: 'Trwają negocjacje warunków'
          },
          {
            id: '6',
            name: 'Zamknięte',
            count: 3,
            percentage: 7,
            color: 'bg-emerald-500',
            icon: '🎉',
            description: 'Umowa podpisana'
          }
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching funnel data:', error);
      setError('Błąd podczas ładowania danych lejka');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie lejka sprzedaży...</p>
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
            onClick={fetchFunnelData}
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
              <h1 className="text-2xl font-bold text-gray-900">Lejek Sprzedaży</h1>
              <p className="text-sm text-gray-500">
                Analiza konwersji i postępów w sprzedaży
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-4">🎯</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Łączne leady</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                    <p className="text-sm text-gray-500">W całym procesie</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">📈</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Konwersja</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                    <p className="text-sm text-gray-500">Lead → Klient</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-500 mr-4">⏱️</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Średni czas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgTimeToClose}</p>
                    <p className="text-sm text-gray-500">dni do zamknięcia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Wizualizacja lejka</h3>
                <p className="text-sm text-gray-600">Przepływ leadów przez kolejne etapy sprzedaży</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {stats.stages.map((stage, index) => (
                    <div key={stage.id} className="relative">
                      {/* Stage Card */}
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <div className={`${stage.color} text-white p-3 rounded-lg text-2xl mr-4`}>
                            {stage.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right mr-6">
                          <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                          <p className="text-sm text-gray-500">leadów</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary-600">{stage.percentage}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${stage.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Arrow to next stage */}
                      {index < stats.stages.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div className="text-gray-400 text-2xl">⬇️</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Conversion Rates */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wskaźniki konwersji</h3>
                <div className="space-y-4">
                  {stats.stages.slice(0, -1).map((stage, index) => {
                    const nextStage = stats.stages[index + 1];
                    const conversionRate = nextStage ? ((nextStage.count / stage.count) * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={`conversion-${stage.id}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {stage.name} → {nextStage?.name}
                        </span>
                        <span className="font-medium text-gray-900">{conversionRate}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-green-500 text-xl mr-3">✅</div>
                      <div>
                        <p className="font-medium text-green-800">Dobra konwersja</p>
                        <p className="text-sm text-green-600">
                          Wskaźnik konwersji {stats.conversionRate}% jest powyżej średniej branżowej
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-blue-500 text-xl mr-3">📊</div>
                      <div>
                        <p className="font-medium text-blue-800">Aktywny pipeline</p>
                        <p className="text-sm text-blue-600">
                          {stats.stages.slice(1, -1).reduce((sum, stage) => sum + stage.count, 0)} leadów w trakcie procesu
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-yellow-500 text-xl mr-3">⏱️</div>
                      <div>
                        <p className="font-medium text-yellow-800">Czas realizacji</p>
                        <p className="text-sm text-yellow-600">
                          Średni czas {stats.avgTimeToClose} dni jest optymalny dla branży
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 