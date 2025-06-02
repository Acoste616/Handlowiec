'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { clientApiClient } from '@/utils/clientApi';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

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
  assignedTo?: string;
  estimatedValue?: number;
  closingProbability: number;
  lastContact?: string;
  nextAction?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadFilters {
  status: string;
  priority: string;
  assignedTo: string;
  source: string;
  search: string;
}

export default function ClientLeadsPage() {
  const { user } = useClientAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);

  const [filters, setFilters] = useState<LeadFilters>({
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    source: 'all',
    search: ''
  });

  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'priority' | 'estimatedValue'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    { value: 'all', label: 'Wszystkie statusy' },
    { value: 'new', label: 'Nowy' },
    { value: 'contacted', label: 'Kontakt' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Propozycja' },
    { value: 'closed', label: 'Zamknięty' },
    { value: 'lost', label: 'Stracony' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Wszystkie priorytety' },
    { value: 'high', label: 'Wysoki' },
    { value: 'medium', label: 'Średni' },
    { value: 'low', label: 'Niski' }
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters, sortBy, sortOrder]);

  const fetchLeads = async () => {
    try {
      setError(null);
      const response = await clientApiClient.getLeads();
      if (response.success && response.data) {
        setLeads(response.data.leads || []);
      } else {
        setError(response.error || 'Błąd podczas ładowania leadów');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Błąd podczas ładowania leadów');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === filters.priority);
    }
    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(lead => lead.assignedTo === filters.assignedTo);
    }
    if (filters.source !== 'all') {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm) ||
        lead.lastName.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
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
      case 'lost': return 'Stracony';
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

  const updateLeadPriority = async (leadId: string, priority: Lead['priority']) => {
    try {
      const response = await clientApiClient.updateLeadPriority(leadId, priority);
      if (response.success) {
        fetchLeads(); // Refresh data
      } else {
        setError(response.error || 'Błąd podczas aktualizacji priorytetu');
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      setError('Błąd podczas aktualizacji priorytetu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie leadów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-gray-900">Leady</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd ładowania</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLeads}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Spróbuj ponownie
            </button>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Moje Leady</h1>
              <p className="text-sm text-gray-500">
                {filteredLeads.length} z {leads.length} leadów - widok tylko do odczytu
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                📊 Podgląd postępów
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
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wyszukaj</label>
              <input
                type="text"
                placeholder="Imię, firma, email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorytet</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sortuj według</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="updatedAt">Ostatnia aktualizacja</option>
                <option value="createdAt">Data utworzenia</option>
                <option value="priority">Priorytet</option>
                <option value="estimatedValue">Wartość</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kolejność</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="desc">Malejąco</option>
                <option value="asc">Rosnąco</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                    Priorytet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ostatni kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{lead.company}</div>
                          <div className="text-xs text-gray-400">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                        {getPriorityText(lead.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.estimatedValue ? `${lead.estimatedValue.toLocaleString()} zł` : '-'}
                      {lead.closingProbability > 0 && (
                        <div className="text-xs text-gray-500">{lead.closingProbability}% szans</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.lastContact ? format(new Date(lead.lastContact), 'd MMM yyyy', { locale: pl }) : 'Brak kontaktu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowLeadDetails(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Zobacz szczegóły
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak leadów</h3>
              <p className="text-gray-500">
                {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                  ? 'Nie znaleziono leadów spełniających kryteria wyszukiwania.'
                  : 'Dodaj pierwszego leada, aby rozpocząć pracę.'}
              </p>
              {(!filters.search && filters.status === 'all' && filters.priority === 'all') && (
                <p className="mt-4 text-gray-500">
                  Skontaktuj się z Twoim agentem, aby dodać nowe leady.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal */}
      {showLeadDetails && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedLead.firstName} {selectedLead.lastName}
              </h3>
              <button
                onClick={() => setShowLeadDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Firma</label>
                  <p className="text-sm text-gray-900">{selectedLead.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="text-sm text-gray-900">{selectedLead.phone || 'Brak'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Źródło</label>
                  <p className="text-sm text-gray-900">{selectedLead.source}</p>
                </div>
              </div>
              
              {selectedLead.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notatki</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLeadDetails(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 