'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface AgentStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalValue: number;
  conversionRate: number;
  avgDealSize: number;
  tasksToday: number;
  callsToday: number;
  emailsSent: number;
  meetingsScheduled: number;
  monthlyTarget: number;
  monthlyProgress: number;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  estimatedValue?: number;
  lastContact?: string;
  nextAction?: string;
  notes: string;
  createdAt: string;
}

interface Task {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up';
  title: string;
  description: string;
  leadId: string;
  leadName: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  estimatedDuration: number;
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [todayLeads, setTodayLeads] = useState<Lead[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'dashboard' | 'leads' | 'tasks' | 'performance'>('dashboard');

  // Mock agent info
  const agentInfo = {
    name: 'Bartek Nowak',
    role: 'Senior Sales Agent',
    avatar: 'BN',
    team: 'Team Alpha',
    startDate: '2023-01-15'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockStats: AgentStats = {
        totalLeads: 156,
        newLeads: 23,
        qualifiedLeads: 47,
        closedDeals: 12,
        totalValue: 485000,
        conversionRate: 7.7,
        avgDealSize: 40416,
        tasksToday: 8,
        callsToday: 15,
        emailsSent: 32,
        meetingsScheduled: 3,
        monthlyTarget: 500000,
        monthlyProgress: 485000
      };

      const mockTodayLeads: Lead[] = [
        {
          id: '1',
          firstName: 'Jan',
          lastName: 'Kowalski',
          company: 'TechCorp Sp. z o.o.',
          email: 'jan.kowalski@techcorp.pl',
          phone: '+48 123 456 789',
          status: 'new',
          priority: 'high',
          source: 'Google Ads',
          estimatedValue: 85000,
          notes: 'Zainteresowany systemem CRM dla 50 pracowników',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Anna',
          lastName: 'Nowak',
          company: 'ProSoft Solutions',
          email: 'anna.nowak@prosoft.pl',
          phone: '+48 987 654 321',
          status: 'contacted',
          priority: 'medium',
          source: 'LinkedIn',
          estimatedValue: 45000,
          lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          nextAction: 'Wysłać propozycję',
          notes: 'Potrzebuje rozwiązania do automatyzacji sprzedaży',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      const mockTodayTasks: Task[] = [
        {
          id: '1',
          type: 'call',
          title: 'Telefon do Jan Kowalski',
          description: 'Pierwszy kontakt - prezentacja rozwiązania',
          leadId: '1',
          leadName: 'Jan Kowalski - TechCorp',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'pending',
          estimatedDuration: 30
        },
        {
          id: '2',
          type: 'email',
          title: 'Wysłać propozycję do Anna Nowak',
          description: 'Przygotować szczegółową ofertę',
          leadId: '2',
          leadName: 'Anna Nowak - ProSoft',
          dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'pending',
          estimatedDuration: 45
        },
        {
          id: '3',
          type: 'meeting',
          title: 'Demo systemu',
          description: 'Prezentacja funkcjonalności CRM',
          leadId: '3',
          leadName: 'Piotr Wiśniewski - DataFlow',
          dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'pending',
          estimatedDuration: 60
        }
      ];

      setStats(mockStats);
      setTodayLeads(mockTodayLeads);
      setTodayTasks(mockTodayTasks);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Błąd podczas ładowania danych');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-500 text-white';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTaskTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'demo': return '🖥️';
      case 'proposal': return '📋';
      case 'follow_up': return '🔄';
      default: return '📝';
    }
  };

  const markTaskCompleted = async (taskId: string) => {
    setTodayTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu handlowca...</p>
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
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-medium">{agentInfo.avatar}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Witaj, {agentInfo.name}! 👋
                </h1>
                <p className="text-sm text-gray-500">
                  {agentInfo.role} • {format(new Date(), 'EEEE, d MMMM yyyy', { locale: pl })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Cel miesięczny</p>
                <p className="text-xs text-gray-500">
                  {stats?.monthlyProgress.toLocaleString()} / {stats?.monthlyTarget.toLocaleString()} zł
                </p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats ? (stats.monthlyProgress / stats.monthlyTarget) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'leads', label: 'Moje Leady', icon: '🎯' },
              { id: 'tasks', label: 'Zadania', icon: '✅' },
              { id: 'performance', label: 'Wyniki', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedView === tab.id
                    ? 'border-blue-500 text-blue-600'
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

        {/* Dashboard View */}
        {selectedView === 'dashboard' && stats && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-4">🎯</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Moje leady</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                    <p className="text-sm text-green-600">+{stats.newLeads} nowych</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">✅</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qualified</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
                    <p className="text-sm text-blue-600">{((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1)}% ratio</p>
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
                    <p className="text-sm font-medium text-gray-600">Zadania na dziś</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.tasksToday}</p>
                    <p className="text-sm text-blue-600">Do wykonania</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Today's Tasks */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Zadania na dziś</h3>
                  <Link
                    href="/agent/tasks"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Zobacz wszystkie →
                  </Link>
                </div>
                <div className="space-y-3">
                  {todayTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTaskTypeIcon(task.type)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.leadName}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(task.dueDate), 'HH:mm')} • {task.estimatedDuration} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                        </span>
                        {task.status === 'pending' && (
                          <button
                            onClick={() => markTaskCompleted(task.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Leads */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Nowe leady</h3>
                  <Link
                    href="/agent/leads"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Zobacz wszystkie →
                  </Link>
                </div>
                <div className="space-y-3">
                  {todayLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{lead.company}</p>
                          <p className="text-xs text-gray-500">{lead.source}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        {lead.estimatedValue && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {lead.estimatedValue.toLocaleString()} zł
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Activity Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dzisiejsza aktywność</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl text-blue-500 mb-2">📞</div>
                  <p className="text-2xl font-bold text-gray-900">{stats.callsToday}</p>
                  <p className="text-sm text-gray-600">Rozmów</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-green-500 mb-2">📧</div>
                  <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
                  <p className="text-sm text-gray-600">Emaili</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-purple-500 mb-2">🤝</div>
                  <p className="text-2xl font-bold text-gray-900">{stats.meetingsScheduled}</p>
                  <p className="text-sm text-gray-600">Spotkań</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-orange-500 mb-2">🎯</div>
                  <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  <p className="text-sm text-gray-600">Konwersja</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other views would be implemented here */}
        {selectedView === 'leads' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Zarządzanie leadami</h3>
            <p className="text-gray-600 mb-4">Szczegółowy widok wszystkich leadów będzie dostępny wkrótce</p>
            <Link
              href="/agent/leads"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Przejdź do leadów
            </Link>
          </div>
        )}

        {selectedView === 'tasks' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Zarządzanie zadaniami</h3>
            <p className="text-gray-600 mb-4">Szczegółowy widok wszystkich zadań będzie dostępny wkrótce</p>
            <Link
              href="/agent/tasks"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Przejdź do zadań
            </Link>
          </div>
        )}

        {selectedView === 'performance' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analiza wyników</h3>
            <p className="text-gray-600 mb-4">Szczegółowe raporty wydajności będą dostępne wkrótce</p>
            <Link
              href="/agent/performance"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Przejdź do wyników
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 