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

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  pipeline: number;
  conversionRate: number;
}

export default function CRMDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'mine'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchStats();
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

  const fetchStats = async () => {
    try {
      const data = await apiClient.get<DashboardStats>('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      fetchStats();
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
    } catch (error) {
      console.error('Error assigning lead:', error);
      setError('Błąd podczas przypisywania leada');
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

  const filteredLeads = leads.filter(lead => {
    if (filter === 'new') return lead.status === 'new';
    if (filter === 'mine') return lead.assignedTo === user?.email;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie dashboard...</p>
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
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Witaj, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Wszystkie leady</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalLeads}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Nowe</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.newLeads}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Qualified</div>
              <div className="text-2xl font-bold text-blue-600">{stats.qualifiedLeads}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Zamknięte</div>
              <div className="text-2xl font-bold text-green-600">{stats.closedDeals}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Pipeline</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.pipeline.toLocaleString()} zł
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-sm font-medium text-gray-500">Konwersja</div>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.conversionRate}%
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Wszystkie ({leads.length})
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'new' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Nowe ({leads.filter(l => l.status === 'new').length})
              </button>
              <button
                onClick={() => setFilter('mine')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'mine' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Moje ({leads.filter(l => l.assignedTo === user?.email).length})
              </button>
            </div>
            
            <button 
              onClick={fetchLeads}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              Odśwież
            </button>
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
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Brak leadów do wyświetlenia
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(lead.priority)}`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.firstName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email}
                            </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo ? (
                          <span className="text-blue-600">{lead.assignedTo.split('@')[0]}</span>
                        ) : (
                          <span className="text-gray-400">Nieprzypisany</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.timestamp), 'dd.MM.yyyy HH:mm', { locale: pl })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Zobacz
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedLead.firstName} - {selectedLead.company}
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
                    <label className="block text-sm font-medium text-gray-700">Wiadomość</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                      {selectedLead.message}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notatki</label>
                    <textarea
                      value={selectedLead.notes}
                      onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      rows={3}
                      placeholder="Dodaj notatki..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id, selectedLead.status, selectedLead.notes)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Zapisz
                    </button>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Zadzwoń: {selectedLead.phone}
                    </a>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 