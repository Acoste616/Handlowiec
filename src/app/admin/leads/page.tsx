'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { apiClient } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface Lead {
  id: string;
  timestamp: string;
  firstName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'rejected';
  assignedTo?: string;
  nextAction?: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  estimatedValue?: number;
}

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'mine' | 'unassigned'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Lead | null>(null);

  const teamMembers = [
    'admin@bezhandlowca.pl',
    'bartek@bezhandlowca.pl',
    'marta@bezhandlowca.pl'
  ];

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      setError(null);
      const data = await apiClient.get<{ leads: Lead[] }>('/api/admin/leads');
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Błąd podczas pobierania leadów');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status'], notes?: string) => {
    try {
      await apiClient.patch(`/api/admin/leads/${leadId}`, {
        status,
        notes,
        updatedBy: user?.email
      });
      
      fetchLeads();
      setSelectedLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
      setError('Błąd podczas aktualizacji leada');
    }
  };

  const assignLead = async (leadId: string, assignedTo: string) => {
    try {
      await apiClient.patch(`/api/admin/leads/${leadId}/assign`, { assignedTo });
      fetchLeads();
      setShowAssignModal(false);
      setAssignTarget(null);
    } catch (error) {
      console.error('Error assigning lead:', error);
      setError('Błąd podczas przypisywania leada');
    }
  };

  const updatePriority = async (leadId: string, priority: Lead['priority']) => {
    try {
      await apiClient.patch(`/api/admin/leads/${leadId}`, {
        priority,
        updatedBy: user?.email
      });
      fetchLeads();
    } catch (error) {
      console.error('Error updating priority:', error);
      setError('Błąd podczas aktualizacji priorytetu');
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Nowy';
      case 'contacted': return 'Kontakt';
      case 'qualified': return 'Qualified';
      case 'proposal': return 'Propozycja';
      case 'closed': return 'Zamknięty';
      case 'rejected': return 'Odrzucony';
      default: return status;
    }
  };

  const getPriorityText = (priority: Lead['priority']) => {
    switch (priority) {
      case 'high': return 'Wysoki';
      case 'medium': return 'Średni';
      case 'low': return 'Niski';
      default: return priority;
    }
  };

  const filteredLeads = leads.filter(lead => {
    // Filter by assignment
    if (filter === 'new' && lead.status !== 'new') return false;
    if (filter === 'mine' && lead.assignedTo !== user?.email) return false;
    if (filter === 'unassigned' && lead.assignedTo) return false;
    
    // Filter by status
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        lead.firstName.toLowerCase().includes(term) ||
        lead.company.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.includes(term)
      );
    }
    
    return true;
  });

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
              Zarządzanie Leadami
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Łącznie: {filteredLeads.length} leadów
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Assignment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Przypisanie
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszystkie ({leads.length})</option>
                <option value="new">Nowe ({leads.filter(l => l.status === 'new').length})</option>
                <option value="mine">Moje ({leads.filter(l => l.assignedTo === user?.email).length})</option>
                <option value="unassigned">Nieprzypisane ({leads.filter(l => !l.assignedTo).length})</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="new">Nowy</option>
                <option value="contacted">Kontakt</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Propozycja</option>
                <option value="closed">Zamknięty</option>
                <option value="rejected">Odrzucony</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Imię, firma, email, telefon..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end">
              <button 
                onClick={fetchLeads}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                Odśwież
              </button>
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
                    Firma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorytet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Przypisany
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm || filter !== 'all' || statusFilter !== 'all' 
                        ? 'Brak leadów spełniających kryteria' 
                        : 'Brak leadów do wyświetlenia'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.company}</div>
                        <div className="text-sm text-gray-500">{lead.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusText(lead.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const priorities: Lead['priority'][] = ['low', 'medium', 'high'];
                            const currentIndex = priorities.indexOf(lead.priority);
                            const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                            updatePriority(lead.id, nextPriority);
                          }}
                          className={`flex items-center text-sm font-medium ${getPriorityColor(lead.priority)} hover:opacity-75`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 bg-current`}></div>
                          {getPriorityText(lead.priority)}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo ? (
                          <span className="text-blue-600">{lead.assignedTo.split('@')[0]}</span>
                        ) : (
                          <button
                            onClick={() => {
                              setAssignTarget(lead);
                              setShowAssignModal(true);
                            }}
                            className="text-gray-400 hover:text-primary-600"
                          >
                            Przypisz
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.timestamp), 'dd.MM.yyyy HH:mm', { locale: pl })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edytuj
                          </button>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Zadzwoń
                          </a>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Email
                          </a>
                          <button
                            onClick={() => {
                              setAssignTarget(lead);
                              setShowAssignModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Przypisz
                          </button>
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Edytuj Lead: {selectedLead.firstName} - {selectedLead.company}
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

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => setSelectedLead({...selectedLead, status: e.target.value as Lead['status']})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="new">Nowy</option>
                        <option value="contacted">Skontaktowany</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Propozycja</option>
                        <option value="closed">Zamknięty</option>
                        <option value="rejected">Odrzucony</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priorytet</label>
                      <select
                        value={selectedLead.priority}
                        onChange={(e) => setSelectedLead({...selectedLead, priority: e.target.value as Lead['priority']})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wartość szacunkowa (zł)</label>
                    <input
                      type="number"
                      value={selectedLead.estimatedValue || ''}
                      onChange={(e) => setSelectedLead({...selectedLead, estimatedValue: e.target.value ? Number(e.target.value) : undefined})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="np. 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Następna akcja</label>
                    <input
                      type="text"
                      value={selectedLead.nextAction || ''}
                      onChange={(e) => setSelectedLead({...selectedLead, nextAction: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="np. Umówić spotkanie w przyszłym tygodniu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wiadomość klienta</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm max-h-32 overflow-y-auto">
                      {selectedLead.message}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notatki</label>
                    <textarea
                      value={selectedLead.notes}
                      onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      rows={4}
                      placeholder="Dodaj notatki o kontakcie z klientem..."
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <div className="flex space-x-3">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                      >
                        📞 {selectedLead.phone}
                      </a>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        ✉️ Email
                      </a>
                    </div>
                    
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, selectedLead.status, selectedLead.notes)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Zapisz zmiany
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && assignTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Przypisz Lead
                  </h3>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssignTarget(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Lead: <strong>{assignTarget.firstName} - {assignTarget.company}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Przypisz do:
                  </label>
                  
                  <div className="space-y-2">
                    {teamMembers.map(member => (
                      <button
                        key={member}
                        onClick={() => assignLead(assignTarget.id, member)}
                        className={`w-full text-left px-4 py-2 rounded-lg border ${
                          assignTarget.assignedTo === member
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {member.split('@')[0]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setAssignTarget(null);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Anuluj
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