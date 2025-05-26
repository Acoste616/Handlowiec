'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Task['type']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Task['priority']>('all');

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
        },
        {
          id: '4',
          type: 'proposal',
          title: 'Przygotowanie oferty dla TechFlow',
          description: 'Oferta na system CRM dla 100 użytkowników',
          leadId: '4',
          leadName: 'TechFlow Solutions',
          dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'overdue',
          estimatedDuration: 90
        },
        {
          id: '5',
          type: 'follow_up',
          title: 'Follow-up po spotkaniu',
          description: 'Podsumowanie spotkania i następne kroki',
          leadId: '5',
          leadName: 'Innovation Labs',
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'completed',
          estimatedDuration: 30
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
      case 'demo': return '🖥️';
      case 'proposal': return '📋';
      case 'follow_up': return '🔄';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markTaskCompleted = async (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => 
    (filterStatus === 'all' || task.status === filterStatus) &&
    (filterType === 'all' || task.type === filterType) &&
    (filterPriority === 'all' || task.priority === filterPriority)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie zadań...</p>
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
              <h1 className="text-2xl font-bold text-blue-600">✅ Zadania</h1>
              <p className="text-sm text-gray-500">
                Zarządzaj swoimi zadaniami i harmonogramem
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/agent/tasks/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Nowe zadanie
              </Link>
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="pending">Oczekujące</option>
                <option value="completed">Zakończone</option>
                <option value="overdue">Przeterminowane</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Typ:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="call">Telefon</option>
                <option value="email">Email</option>
                <option value="meeting">Spotkanie</option>
                <option value="demo">Demo</option>
                <option value="proposal">Oferta</option>
                <option value="follow_up">Follow-up</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Priorytet:</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="high">Wysoki</option>
                <option value="medium">Średni</option>
                <option value="low">Niski</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zadanie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Termin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zadań</h3>
                      <p className="text-gray-500 mb-4">
                        {filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
                          ? 'Nie znaleziono zadań o wybranych kryteriach.'
                          : 'Nie masz żadnych zadań do wykonania.'}
                      </p>
                      <Link
                        href="/agent/tasks/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Utwórz pierwsze zadanie
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTaskTypeIcon(task.type)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.description}</div>
                            <div className="text-xs text-gray-400">
                              {task.estimatedDuration} min • {task.priority} priorytet
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.leadName}</div>
                        <Link
                          href={`/agent/leads/${task.leadId}`}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          Zobacz leada
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(task.dueDate), 'HH:mm, d MMM', { locale: pl })}
                        </div>
                        {task.status === 'overdue' && (
                          <div className="text-xs text-red-600">Przeterminowane</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' ? 'Oczekujące' :
                           task.status === 'completed' ? 'Zakończone' : 'Przeterminowane'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => markTaskCompleted(task.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              ✓ Zakończ
                            </button>
                          )}
                          <Link
                            href={`/agent/tasks/${task.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Szczegóły
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 