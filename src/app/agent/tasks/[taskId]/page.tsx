'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  notes?: string;
  attachments?: string[];
  relatedTasks?: string[];
}

export default function TaskDetailsPage({ params }: { params: { taskId: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    fetchTaskDetails();
  }, [params.taskId]);

  const fetchTaskDetails = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockTask: Task = {
        id: params.taskId,
        type: 'call',
        title: 'Telefon do Jan Kowalski',
        description: 'Pierwszy kontakt - prezentacja rozwiązania',
        leadId: '1',
        leadName: 'Jan Kowalski - TechCorp',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'pending',
        estimatedDuration: 30,
        notes: 'Klient jest zainteresowany systemem CRM dla 50 użytkowników. Należy przedstawić główne funkcjonalności i omówić proces wdrożenia.',
        attachments: ['prezentacja_crm.pdf', 'cennik_2024.xlsx'],
        relatedTasks: ['2', '3']
      };

      setTask(mockTask);
      setEditedTask(mockTask);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError('Błąd podczas ładowania szczegółów zadania');
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

  const handleSave = async () => {
    try {
      // Symulacja zapisu - w produkcji to byłby prawdziwy API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTask(prev => prev ? { ...prev, ...editedTask } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Błąd podczas zapisywania zmian');
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      // Symulacja zmiany statusu - w produkcji to byłby prawdziwy API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error changing task status:', error);
      setError('Błąd podczas zmiany statusu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów zadania...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nie znaleziono zadania</h3>
          <p className="text-gray-500 mb-4">
            Zadanie o podanym ID nie istnieje lub zostało usunięte.
          </p>
          <Link
            href="/agent/tasks"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Wróć do listy zadań
          </Link>
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
              <Link
                href="/agent/tasks"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Wróć
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  {getTaskTypeIcon(task.type)} {task.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Szczegóły zadania
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edytuj
                  </button>
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Oznacz jako wykonane
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTask(task);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Zapisz zmiany
                  </button>
                </>
              )}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Szczegóły zadania</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tytuł
                    </label>
                    <input
                      type="text"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opis
                    </label>
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notatki
                    </label>
                    <textarea
                      value={editedTask.notes}
                      onChange={(e) => setEditedTask(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Opis</h3>
                    <p className="mt-1 text-gray-900">{task.description}</p>
                  </div>

                  {task.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Notatki</h3>
                      <p className="mt-1 text-gray-900">{task.notes}</p>
                    </div>
                  )}

                  {task.attachments && task.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Załączniki</h3>
                      <ul className="mt-2 space-y-2">
                        {task.attachments.map((attachment, index) => (
                          <li key={index} className="flex items-center text-blue-600 hover:text-blue-800">
                            <span className="mr-2">📎</span>
                            {attachment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {task.relatedTasks && task.relatedTasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Powiązane zadania</h2>
                <div className="space-y-4">
                  {task.relatedTasks.map((relatedTaskId) => (
                    <Link
                      key={relatedTaskId}
                      href={`/agent/tasks/${relatedTaskId}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            Zadanie #{relatedTaskId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Kliknij aby zobaczyć szczegóły
                          </p>
                        </div>
                        <span className="text-blue-600">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informacje</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status === 'pending' ? 'Oczekujące' :
                     task.status === 'completed' ? 'Zakończone' : 'Przeterminowane'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priorytet</h3>
                  <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Wysoki' :
                     task.priority === 'medium' ? 'Średni' : 'Niski'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Termin</h3>
                  <p className="text-sm text-gray-900">
                    {format(new Date(task.dueDate), 'd MMMM yyyy, HH:mm', { locale: pl })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Szacowany czas</h3>
                  <p className="text-sm text-gray-900">
                    {task.estimatedDuration} minut
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lead</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nazwa</h3>
                  <p className="text-sm text-gray-900">{task.leadName}</p>
                </div>

                <Link
                  href={`/agent/leads/${task.leadId}`}
                  className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Zobacz szczegóły leada
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 