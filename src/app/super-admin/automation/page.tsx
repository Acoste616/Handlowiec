'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'new_lead' | 'lead_score' | 'time_based' | 'behavior' | 'email_opened';
  conditions: string[];
  actions: string[];
  status: 'active' | 'paused' | 'draft';
  leadsProcessed: number;
  conversionRate: number;
  createdAt: string;
  lastTriggered?: string;
}

interface LeadScore {
  leadId: string;
  leadName: string;
  company: string;
  score: number;
  factors: {
    demographic: number;
    behavioral: number;
    engagement: number;
    firmographic: number;
  };
  recommendation: 'hot' | 'warm' | 'cold' | 'nurture';
  lastUpdated: string;
}

interface AutomationStats {
  totalRules: number;
  activeRules: number;
  leadsProcessed: number;
  automatedEmails: number;
  avgResponseTime: number;
  conversionLift: number;
  timesSaved: number;
  aiAccuracy: number;
}

export default function AutomationPage() {
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [leadScores, setLeadScores] = useState<LeadScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'rules' | 'scoring' | 'analytics'>('overview');

  useEffect(() => {
    fetchAutomationData();
  }, []);

  const fetchAutomationData = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: AutomationStats = {
        totalRules: 12,
        activeRules: 9,
        leadsProcessed: 1847,
        automatedEmails: 5234,
        avgResponseTime: 2.3,
        conversionLift: 34.5,
        timesSaved: 156,
        aiAccuracy: 87.2
      };

      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Nowy lead z wysokim score',
          description: 'Automatyczne przypisanie do top agenta gdy lead score > 80',
          trigger: 'lead_score',
          conditions: ['Lead score > 80', 'Firma > 50 pracowników'],
          actions: ['Przypisz do Bartek Nowak', 'Wyślij email powitalny', 'Zaplanuj telefon w 1h'],
          status: 'active',
          leadsProcessed: 234,
          conversionRate: 23.5,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Email nurturing sequence',
          description: 'Seria 5 emaili dla leadów z niskim zaangażowaniem',
          trigger: 'behavior',
          conditions: ['Brak aktywności > 7 dni', 'Email nie otwarty'],
          actions: ['Wyślij email #1', 'Czekaj 3 dni', 'Wyślij email #2', 'Czekaj 5 dni'],
          status: 'active',
          leadsProcessed: 567,
          conversionRate: 12.8,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Reaktywacja zimnych leadów',
          description: 'AI-powered reaktywacja leadów po 30 dniach nieaktywności',
          trigger: 'time_based',
          conditions: ['Brak aktywności > 30 dni', 'Status = cold'],
          actions: ['Analiza AI', 'Personalizowany email', 'LinkedIn outreach'],
          status: 'active',
          leadsProcessed: 123,
          conversionRate: 8.9,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      const mockLeadScores: LeadScore[] = [
        {
          leadId: '1',
          leadName: 'Jan Kowalski',
          company: 'TechCorp Sp. z o.o.',
          score: 92,
          factors: {
            demographic: 85,
            behavioral: 95,
            engagement: 90,
            firmographic: 98
          },
          recommendation: 'hot',
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          leadId: '2',
          leadName: 'Anna Nowak',
          company: 'ProSoft Solutions',
          score: 76,
          factors: {
            demographic: 80,
            behavioral: 70,
            engagement: 85,
            firmographic: 70
          },
          recommendation: 'warm',
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          leadId: '3',
          leadName: 'Piotr Wiśniewski',
          company: 'DataFlow Ltd.',
          score: 45,
          factors: {
            demographic: 60,
            behavioral: 30,
            engagement: 40,
            firmographic: 50
          },
          recommendation: 'nurture',
          lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setStats(mockStats);
      setRules(mockRules);
      setLeadScores(mockLeadScores);
    } catch (error) {
      console.error('Error fetching automation data:', error);
      setError('Błąd podczas ładowania danych automatyzacji');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: AutomationRule['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: LeadScore['recommendation']) => {
    switch (recommendation) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      case 'nurture': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  const toggleRuleStatus = async (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie systemu automatyzacji...</p>
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
              <h1 className="text-2xl font-bold text-red-600">🤖 Automatyzacja AI</h1>
              <p className="text-sm text-gray-500">
                Inteligentne zarządzanie leadami i procesami sprzedaży
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/super-admin/automation/new"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Nowa reguła
              </Link>
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
              { id: 'rules', label: 'Reguły', icon: '⚙️' },
              { id: 'scoring', label: 'Lead Scoring', icon: '🎯' },
              { id: 'analytics', label: 'Analityka', icon: '📈' }
            ].map((tab) => (
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
                  <div className="text-3xl text-blue-500 mr-4">⚙️</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktywne reguły</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRules}</p>
                    <p className="text-sm text-gray-500">z {stats.totalRules} łącznie</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">🎯</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Przetworzone leady</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.leadsProcessed}</p>
                    <p className="text-sm text-green-600">+{stats.automatedEmails} emaili</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-500 mr-4">⚡</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Czas odpowiedzi</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}min</p>
                    <p className="text-sm text-blue-600">Średnio</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-orange-500 mr-4">📈</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wzrost konwersji</p>
                    <p className="text-2xl font-bold text-gray-900">+{stats.conversionLift}%</p>
                    <p className="text-sm text-green-600">Dzięki AI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wydajność AI</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dokładność predykcji</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${stats.aiAccuracy}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{stats.aiAccuracy}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Zaoszczędzony czas</span>
                    <span className="font-medium text-blue-600">{stats.timesSaved}h/miesiąc</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Automatyzacja procesów</span>
                    <span className="font-medium text-purple-600">78%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Najlepsze reguły</h3>
                <div className="space-y-3">
                  {rules.slice(0, 3).map((rule) => (
                    <div key={rule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{rule.name}</p>
                        <p className="text-sm text-gray-600">{rule.leadsProcessed} leadów</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{rule.conversionRate}%</p>
                        <p className="text-xs text-gray-500">konwersja</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Rules Tab */}
        {selectedView === 'rules' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reguły automatyzacji</h3>
                  <p className="text-sm text-gray-600">Zarządzaj regułami automatycznego przetwarzania leadów</p>
                </div>
                <Link
                  href="/super-admin/automation/new-rule"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Nowa reguła
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reguła
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trigger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wydajność
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                          <div className="text-sm text-gray-500">{rule.description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {rule.lastTriggered ? 
                              `Ostatnio: ${format(new Date(rule.lastTriggered), 'HH:mm, d MMM', { locale: pl })}` :
                              'Nie uruchamiana'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {rule.trigger}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rule.status)}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{rule.leadsProcessed} leadów</div>
                        <div className="text-green-600">{rule.conversionRate}% konwersja</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleRuleStatus(rule.id)}
                            className={`${
                              rule.status === 'active' 
                                ? 'text-yellow-600 hover:text-yellow-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {rule.status === 'active' ? 'Wstrzymaj' : 'Aktywuj'}
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Edytuj
                          </button>
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

        {/* Lead Scoring Tab */}
        {selectedView === 'scoring' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Lead Scoring</h3>
              <p className="text-gray-600 mb-6">
                System AI automatycznie ocenia leady na podstawie 50+ czynników i przypisuje im score od 0 do 100.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl text-red-600 mb-2">🔥</div>
                  <div className="font-semibold text-red-600">HOT (80-100)</div>
                  <div className="text-sm text-gray-600">Natychmiastowy kontakt</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl text-yellow-600 mb-2">🌡️</div>
                  <div className="font-semibold text-yellow-600">WARM (60-79)</div>
                  <div className="text-sm text-gray-600">Kontakt w 24h</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-600 mb-2">❄️</div>
                  <div className="font-semibold text-blue-600">COLD (40-59)</div>
                  <div className="text-sm text-gray-600">Kontakt w tygodniu</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl text-purple-600 mb-2">🌱</div>
                  <div className="font-semibold text-purple-600">NURTURE (0-39)</div>
                  <div className="text-sm text-gray-600">Automatyczne nurturing</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Najnowsze oceny leadów</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Czynniki
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rekomendacja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ostatnia aktualizacja
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leadScores.map((lead) => (
                      <tr key={lead.leadId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.leadName}</div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`text-2xl font-bold ${getScoreColor(lead.score)} mr-2`}>
                              {lead.score}
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  lead.score >= 80 ? 'bg-red-500' :
                                  lead.score >= 60 ? 'bg-yellow-500' :
                                  lead.score >= 40 ? 'bg-blue-500' : 'bg-gray-500'
                                }`}
                                style={{ width: `${lead.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div>Demo: {lead.factors.demographic}</div>
                            <div>Behav: {lead.factors.behavioral}</div>
                            <div>Engage: {lead.factors.engagement}</div>
                            <div>Firmo: {lead.factors.firmographic}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(lead.recommendation)}`}>
                            {lead.recommendation.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(lead.lastUpdated), 'HH:mm, d MMM', { locale: pl })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedView === 'analytics' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Zaawansowana analityka</h3>
            <p className="text-gray-600 mb-4">Szczegółowe raporty wydajności automatyzacji będą dostępne wkrótce</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <div className="font-semibold">Raporty ROI</div>
                <div className="text-sm text-gray-600">Zwrot z inwestycji w automatyzację</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl text-green-600 mb-2">⚡</div>
                <div className="font-semibold">Optymalizacja AI</div>
                <div className="text-sm text-gray-600">Sugestie poprawy wydajności</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl text-purple-600 mb-2">🎯</div>
                <div className="font-semibold">Predykcje</div>
                <div className="text-sm text-gray-600">Przewidywania konwersji</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 