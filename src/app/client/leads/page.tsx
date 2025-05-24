'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { clientApiClient } from '@/utils/clientApi';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Lead {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedValue?: number;
  closingProbability?: number;
  nextAction?: string;
  notes: string;
  lastActivity?: string;
  timeline: TimelineActivity[];
  recordings?: CallRecording[];
}

interface TimelineActivity {
  id: string;
  timestamp: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  agentName: string;
  description: string;
  details?: string;
  duration?: number;
}

interface CallRecording {
  id: string;
  timestamp: string;
  duration: number;
  quality: 'good' | 'fair' | 'poor';
  transcript?: string;
  summary?: string;
}

export default function ClientLeadsPage() {
  const { user } = useClientAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    agent: 'all',
    source: 'all',
    priority: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinCallModal, setShowJoinCallModal] = useState(false);
  const [joinCallLead, setJoinCallLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLeads: Lead[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          firstName: 'Jan',
          lastName: 'Kowalski',
          company: 'Kowalski Sp. z o.o.',
          email: 'jan@kowalski.com',
          phone: '+48 123 456 789',
          message: 'Szukamy rozwiązania do automatyzacji procesów sprzedażowych',
          source: 'Strona www',
          status: 'contacted',
          assignedTo: 'Bartek Nowak',
          priority: 'high',
          estimatedValue: 85000,
          closingProbability: 75,
          nextAction: 'Prezentacja produktu w przyszłym tygodniu',
          notes: 'Bardzo zainteresowany, ma budżet. CEO podejmuje decyzje szybko.',
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          timeline: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              type: 'call',
              agentName: 'Bartek Nowak',
              description: 'Rozmowa telefoniczna',
              details: 'Omówienie potrzeb i budżetu. Bardzo pozytywne nastawienie.',
              duration: 25
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              type: 'note',
              agentName: 'Bartek Nowak',
              description: 'Lead przypisany',
              details: 'Nowy lead z wysokim potencjałem'
            }
          ],
          recordings: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              duration: 25,
              quality: 'good',
              summary: 'Klient potwierdził zainteresowanie i budżet. Umówiona prezentacja na przyszły tydzień.'
            }
          ]
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          firstName: 'Anna',
          lastName: 'Nowak',
          company: 'TechCorp',
          email: 'anna@techcorp.pl',
          phone: '+48 987 654 321',
          message: 'Potrzebujemy wsparcia w sprzedaży B2B',
          source: 'LinkedIn',
          status: 'new',
          assignedTo: 'Marta Kowalska',
          priority: 'medium',
          estimatedValue: 45000,
          closingProbability: 30,
          nextAction: 'Pierwszy kontakt telefoniczny',
          notes: '',
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          timeline: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              type: 'note',
              agentName: 'Marta Kowalska',
              description: 'Lead przypisany',
              details: 'Nowy lead z LinkedIn'
            }
          ],
          recordings: []
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          firstName: 'Piotr',
          lastName: 'Wiśniewski',
          company: 'ProSoft',
          email: 'piotr@prosoft.pl',
          phone: '+48 555 777 888',
          message: 'Rozważamy outsourcing sprzedaży',
          source: 'Google Ads',
          status: 'closed',
          assignedTo: 'Tomasz Wiśniewski',
          priority: 'high',
          estimatedValue: 120000,
          closingProbability: 100,
          nextAction: 'Podpisanie umowy',
          notes: 'Deal zamknięty! Umowa na 12 miesięcy.',
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          timeline: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              type: 'status_change',
              agentName: 'Tomasz Wiśniewski',
              description: 'Status zmieniony na: zamknięty',
              details: 'Umowa podpisana, projekt rozpoczęty'
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              type: 'call',
              agentName: 'Tomasz Wiśniewski',
              description: 'Finalizacja umowy',
              duration: 45
            }
          ],
          recordings: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              duration: 45,
              quality: 'good',
              summary: 'Finalne negocjacje zakończone sukcesem. Umowa podpisana.'
            }
          ]
        }
      ];

      // Apply filters
      let filteredLeads = mockLeads;
      
      if (filters.status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      
      if (filters.agent !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.assignedTo === filters.agent);
      }
      
      if (filters.source !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
      }
      
      if (filters.priority !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.priority === filters.priority);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.firstName.toLowerCase().includes(searchLower) ||
          lead.lastName.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower)
        );
      }

      setLeads(filteredLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Błąd podczas pobierania leadów');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Nowy';
      case 'contacted': return 'Kontakt';
      case 'qualified': return 'Qualified';
      case 'proposal': return 'Propozycja';
      case 'closed': return 'Zamknięty';
      case 'lost': return 'Utracony';
      default: return status;
    }
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
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

  const getTimelineIcon = (type: TimelineActivity['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '✉️';
      case 'meeting': return '🤝';
      case 'note': return '📝';
      case 'status_change': return '🔄';
      default: return '📋';
    }
  };

  const handleJoinCall = (lead: Lead) => {
    setJoinCallLead(lead);
    setShowJoinCallModal(true);
  };

  const agents = ['Bartek Nowak', 'Marta Kowalska', 'Tomasz Wiśniewski'];
  const sources = ['Strona www', 'LinkedIn', 'Google Ads', 'Polecenie'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie leadów...</p>
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
              Podgląd Leadów
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {leads.length} leadów
              </span>
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
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszystkie</option>
                <option value="new">Nowy</option>
                <option value="contacted">Kontakt</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Propozycja</option>
                <option value="closed">Zamknięty</option>
                <option value="lost">Utracony</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Handlowiec</label>
              <select
                value={filters.agent}
                onChange={(e) => setFilters({...filters, agent: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszyscy</option>
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Źródło</label>
              <select
                value={filters.source}
                onChange={(e) => setFilters({...filters, source: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszystkie</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorytet</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszystkie</option>
                <option value="high">Wysoki</option>
                <option value="medium">Średni</option>
                <option value="low">Niski</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Szukaj</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Imię, firma, email..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlowiec
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prawdopodobieństwo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ostatnia aktywność
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Brak leadów spełniających kryteria
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${getPriorityColor(lead.priority)}`} 
                               style={{ backgroundColor: 'currentColor' }}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                            <div className="text-xs text-gray-400">{lead.source}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusText(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo || 'Nieprzypisany'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${lead.closingProbability || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{lead.closingProbability || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.lastActivity && 
                          format(new Date(lead.lastActivity), 'dd.MM HH:mm', { locale: pl })
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Zobacz
                          </button>
                          {lead.status === 'contacted' && (
                            <button
                              onClick={() => handleJoinCall(lead)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Dołącz
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {selectedLead.firstName} {selectedLead.lastName} - {selectedLead.company}
                  </h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Lead Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Informacje o leadzie</h4>
                    <div className="space-y-3 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedLead.email}</div>
                      <div><span className="font-medium">Telefon:</span> {selectedLead.phone}</div>
                      <div><span className="font-medium">Źródło:</span> {selectedLead.source}</div>
                      <div><span className="font-medium">Przypisany:</span> {selectedLead.assignedTo}</div>
                      <div><span className="font-medium">Wartość:</span> {selectedLead.estimatedValue ? formatCurrency(selectedLead.estimatedValue) : 'Nie określono'}</div>
                      <div><span className="font-medium">Prawdopodobieństwo:</span> {selectedLead.closingProbability}%</div>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-2">Wiadomość:</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedLead.message}</p>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-2">Następne kroki:</h5>
                      <p className="text-sm text-gray-600">{selectedLead.nextAction || 'Brak zaplanowanych kroków'}</p>
                    </div>

                    <div className="mt-6">
                      <h5 className="font-medium text-gray-900 mb-2">Notatki:</h5>
                      <p className="text-sm text-gray-600">{selectedLead.notes || 'Brak notatek'}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleJoinCall(selectedLead)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        🤝 Dołącz do rozmowy
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        📧 Prześlij podsumowanie
                      </button>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                        ⚡ Zmień priorytet
                      </button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Historia aktywności</h4>
                    <div className="space-y-4">
                      {selectedLead.timeline.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="text-lg">{getTimelineIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.description}
                              </p>
                              <span className="text-xs text-gray-500">
                                {format(new Date(activity.timestamp), 'dd.MM HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{activity.agentName}</p>
                            {activity.details && (
                              <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                            )}
                            {activity.duration && (
                              <p className="text-xs text-gray-400 mt-1">Czas trwania: {activity.duration} min</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recordings */}
                    {selectedLead.recordings && selectedLead.recordings.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-medium text-gray-900 mb-4">Nagrania rozmów</h4>
                        <div className="space-y-3">
                          {selectedLead.recordings.map((recording) => (
                            <div key={recording.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  {format(new Date(recording.timestamp), 'dd.MM.yyyy HH:mm')}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    recording.quality === 'good' ? 'bg-green-100 text-green-800' :
                                    recording.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {recording.quality === 'good' ? 'Dobra jakość' :
                                     recording.quality === 'fair' ? 'Średnia jakość' : 'Słaba jakość'}
                                  </span>
                                  <span className="text-xs text-gray-500">{recording.duration} min</span>
                                </div>
                              </div>
                              {recording.summary && (
                                <p className="text-sm text-gray-600">{recording.summary}</p>
                              )}
                              <div className="mt-2 flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-xs">
                                  🎧 Odsłuchaj
                                </button>
                                <button className="text-purple-600 hover:text-purple-800 text-xs">
                                  📝 Transkrypcja
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Join Call Modal */}
        {showJoinCallModal && joinCallLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Dołącz do rozmowy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Czy chcesz dołączyć do rozmowy z klientem <strong>{joinCallLead.firstName} {joinCallLead.lastName}</strong> 
                  ({joinCallLead.company})?
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Handlowiec zostanie powiadomiony o Twojej chęci dołączenia do rozmowy.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowJoinCallModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => {
                      // Handle join call request
                      setShowJoinCallModal(false);
                      setJoinCallLead(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Dołącz do rozmowy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 