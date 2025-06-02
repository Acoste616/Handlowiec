'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'demo' | 'proposal';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  leadId?: string;
  leadName?: string;
  leadCompany?: string;
  assignedTo: string;
  estimatedDuration: number; // w minutach
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

interface CalendarDay {
  date: Date;
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function ClientTasksPage() {
  const { user } = useClientAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterType, setFilterType] = useState<'all' | Task['type']>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Rozmowa z Jan Kowalski',
          description: 'Prezentacja produktu i omówienie potrzeb',
          type: 'call',
          priority: 'high',
          status: 'pending',
          dueDate: new Date().toISOString(),
          leadId: '1',
          leadName: 'Jan Kowalski',
          leadCompany: 'TechCorp',
          assignedTo: 'Bartek Nowak',
          estimatedDuration: 45,
          notes: 'Przygotować prezentację z case studies',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Follow-up email do Anna Nowak',
          description: 'Wysłanie materiałów po pierwszej rozmowie',
          type: 'email',
          priority: 'medium',
          status: 'pending',
          dueDate: addDays(new Date(), 1).toISOString(),
          leadId: '2',
          leadName: 'Anna Nowak',
          leadCompany: 'ProSoft',
          assignedTo: 'Marta Kowalska',
          estimatedDuration: 15,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Demo produktu',
          description: 'Prezentacja live demo dla zespołu technicznego',
          type: 'demo',
          priority: 'high',
          status: 'pending',
          dueDate: addDays(new Date(), 2).toISOString(),
          leadId: '3',
          leadName: 'Piotr Wiśniewski',
          leadCompany: 'DataFlow',
          assignedTo: 'Tomasz Wiśniewski',
          estimatedDuration: 90,
          notes: 'Przygotować środowisko testowe',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          title: 'Spotkanie w biurze klienta',
          description: 'Finalne negocjacje i podpisanie umowy',
          type: 'meeting',
          priority: 'high',
          status: 'completed',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          leadId: '4',
          leadName: 'Maria Kowalczyk',
          leadCompany: 'InnoTech',
          assignedTo: 'Bartek Nowak',
          estimatedDuration: 120,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          title: 'Przygotowanie propozycji',
          description: 'Stworzenie dedykowanej oferty handlowej',
          type: 'proposal',
          priority: 'medium',
          status: 'in_progress',
          dueDate: addDays(new Date(), 3).toISOString(),
          leadId: '5',
          leadName: 'Tomasz Zieliński',
          leadCompany: 'GreenTech',
          assignedTo: 'Marta Kowalska',
          estimatedDuration: 180,
          notes: 'Uwzględnić specjalne wymagania dotyczące integracji',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Błąd podczas ładowania zadań');
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'meeting': return '🤝';
      case 'follow_up': return '🔄';
      case 'demo': return '🖥️';
      case 'proposal': return '📋';
      default: return '📝';
    }
  };

  const getTaskTypeText = (type: Task['type']) => {
    switch (type) {
      case 'call': return 'Rozmowa';
      case 'email': return 'Email';
      case 'meeting': return 'Spotkanie';
      case 'follow_up': return 'Follow-up';
      case 'demo': return 'Demo';
      case 'proposal': return 'Propozycja';
      default: return type;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Oczekuje';
      case 'in_progress': return 'W trakcie';
      case 'completed': return 'Zakończone';
      case 'cancelled': return 'Anulowane';
      default: return status;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterType !== 'all' && task.type !== filterType) return false;
    return true;
  });

  const todayTasks = tasks.filter(task => 
    isSameDay(new Date(task.dueDate), new Date()) && task.status !== 'completed'
  );

  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'completed'
  );

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      // Symulacja API call
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status, 
              completedAt: status === 'completed' ? new Date().toISOString() : undefined 
            }
          : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Błąd podczas aktualizacji zadania');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie zadań...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Zadania</h1>
              <p className="text-sm text-gray-500">
                {todayTasks.length} zadań na dziś
                {overdueTasks.length > 0 && (
                  <span className="text-red-600 ml-2">• {overdueTasks.length} przeterminowanych</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('list')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedView === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  📋 Lista
                </button>
                <button
                  onClick={() => setSelectedView('calendar')}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedView === 'calendar' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  📅 Kalendarz
                </button>
              </div>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Nowe zadanie
              </button>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl text-blue-500 mr-3">📋</div>
              <div>
                <p className="text-sm text-gray-600">Wszystkie</p>
                <p className="text-xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl text-yellow-500 mr-3">⏰</div>
              <div>
                <p className="text-sm text-gray-600">Na dziś</p>
                <p className="text-xl font-bold text-gray-900">{todayTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl text-red-500 mr-3">🚨</div>
              <div>
                <p className="text-sm text-gray-600">Przeterminowane</p>
                <p className="text-xl font-bold text-gray-900">{overdueTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-2xl text-green-500 mr-3">✅</div>
              <div>
                <p className="text-sm text-gray-600">Zakończone</p>
                <p className="text-xl font-bold text-gray-900">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="pending">Oczekujące</option>
                <option value="completed">Zakończone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie typy</option>
                <option value="call">Rozmowy</option>
                <option value="email">Emaile</option>
                <option value="meeting">Spotkania</option>
                <option value="demo">Demo</option>
                <option value="proposal">Propozycje</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {selectedView === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zadań</h3>
                  <p className="text-gray-500">
                    {filterStatus !== 'all' || filterType !== 'all'
                      ? 'Nie znaleziono zadań spełniających kryteria.'
                      : 'Dodaj pierwsze zadanie, aby rozpocząć pracę.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl">{getTaskTypeIcon(task.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                              {getStatusText(task.status)}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                              {task.priority === 'high' ? 'Wysoki' : 
                               task.priority === 'medium' ? 'Średni' : 'Niski'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{task.description}</p>
                          {task.leadName && (
                            <p className="text-sm text-gray-500 mb-2">
                              Lead: {task.leadName} - {task.leadCompany}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>📅 {format(new Date(task.dueDate), 'd MMM yyyy, HH:mm', { locale: pl })}</span>
                            <span>⏱️ {task.estimatedDuration} min</span>
                            <span>👤 {task.assignedTo}</span>
                          </div>
                          {task.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              💡 {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {task.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Rozpocznij
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Zakończ
                            </button>
                          </>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Zakończ
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <span className="text-green-600 text-sm">
                            ✅ Zakończone {task.completedAt && format(new Date(task.completedAt), 'd MMM', { locale: pl })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {selectedView === 'calendar' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Widok kalendarza</h3>
            <p className="text-gray-600">Widok kalendarza będzie dostępny wkrótce.</p>
          </div>
        )}

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nowe zadanie</h3>
              <p className="text-gray-600 mb-4">Funkcja dodawania nowego zadania będzie dostępna wkrótce.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 