'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'referral' | 'cold_call' | 'event' | 'other';
  value: number;
  lastContact: string;
  nextAction: string;
  notes: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Lead['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Lead['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
    
    // Sprawdź czy jest komunikat o sukcesie w URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const leadId = urlParams.get('leadId');
    
    if (success === 'lead-created') {
      setSuccessMessage(`✅ Lead został pomyślnie dodany do systemu!${leadId ? ` (ID: ${leadId})` : ''}`);
      
      // Usuń parametry z URL po 5 sekundach
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setSuccessMessage(null);
      }, 5000);
    }
  }, []);

  const fetchLeads = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Jan Kowalski',
          company: 'TechCorp',
          email: 'jan@techcorp.pl',
          phone: '+48 123 456 789',
          status: 'qualified',
          priority: 'high',
          source: 'website',
          value: 50000,
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          nextAction: 'Przygotowanie oferty',
          notes: 'Interesuje się systemem CRM dla 50 użytkowników'
        },
        {
          id: '2',
          name: 'Anna Nowak',
          company: 'ProSoft',
          email: 'anna@prosoft.pl',
          phone: '+48 987 654 321',
          status: 'proposal',
          priority: 'medium',
          source: 'referral',
          value: 75000,
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          nextAction: 'Follow-up po wysłaniu oferty',
          notes: 'Oczekuje na akceptację oferty przez zarząd'
        },
        {
          id: '3',
          name: 'Piotr Wiśniewski',
          company: 'DataFlow',
          email: 'piotr@dataflow.pl',
          phone: '+48 555 666 777',
          status: 'new',
          priority: 'high',
          source: 'event',
          value: 100000,
          lastContact: new Date(Date.now()).toISOString(),
          nextAction: 'Pierwszy kontakt',
          notes: 'Poznany na konferencji IT'
        },
        {
          id: '4',
          name: 'Magdalena Lewandowska',
          company: 'Innovation Labs',
          email: 'magda@innovation.pl',
          phone: '+48 888 999 000',
          status: 'negotiation',
          priority: 'high',
          source: 'cold_call',
          value: 150000,
          lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          nextAction: 'Negocjacja warunków',
          notes: 'Interesuje się rozszerzonym pakietem'
        },
        {
          id: '5',
          name: 'Tomasz Zieliński',
          company: 'Future Tech',
          email: 'tomasz@futuretech.pl',
          phone: '+48 111 222 333',
          status: 'lost',
          priority: 'low',
          source: 'website',
          value: 25000,
          lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          nextAction: 'Follow-up za 3 miesiące',
          notes: 'Zdecydował się na konkurencję'
        }
      ];

      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Błąd podczas ładowania leadów');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
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

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Nowy';
      case 'contacted': return 'Skontaktowany';
      case 'qualified': return 'Zakwalifikowany';
      case 'proposal': return 'Oferta';
      case 'negotiation': return 'Negocjacje';
      case 'closed': return 'Zamknięty';
      case 'lost': return 'Stracony';
      default: return status;
    }
  };

  const filteredLeads = leads.filter(lead => 
    (filterStatus === 'all' || lead.status === filterStatus) &&
    (filterPriority === 'all' || lead.priority === filterPriority) &&
    (searchQuery === '' || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            <div>
              <h1 className="text-2xl font-bold text-blue-600">👥 Leady</h1>
              <p className="text-sm text-gray-500">
                Zarządzaj swoimi leadami i kontaktami
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/agent/leads/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Nowy lead
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-green-500 hover:text-green-700"
            >
              ✕
            </button>
          </div>
        )}

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

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Szukaj po imieniu, firmie lub emailu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="new">Nowe</option>
                <option value="contacted">Skontaktowane</option>
                <option value="qualified">Zakwalifikowane</option>
                <option value="proposal">Oferty</option>
                <option value="negotiation">Negocjacje</option>
                <option value="closed">Zamknięte</option>
                <option value="lost">Stracone</option>
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

        {/* Leads List */}
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
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ostatni kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Następna akcja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">👥</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak leadów</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery !== '' || filterStatus !== 'all' || filterPriority !== 'all'
                          ? 'Nie znaleziono leadów o wybranych kryteriach.'
                          : 'Nie masz jeszcze żadnych leadów.'}
                      </p>
                      <Link
                        href="/agent/leads/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Dodaj pierwszego leada
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                            <div className="text-xs text-gray-400">
                              {lead.email} • {lead.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                        <div className={`text-xs mt-1 ${getPriorityColor(lead.priority)}`}>
                          {lead.priority} priorytet
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Intl.NumberFormat('pl-PL', {
                            style: 'currency',
                            currency: 'PLN'
                          }).format(lead.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(lead.lastContact), 'd MMM yyyy', { locale: pl })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.nextAction}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/agent/leads/${lead.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Szczegóły
                          </Link>
                          <button
                            onClick={() => window.location.href = `mailto:${lead.email}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => window.location.href = `tel:${lead.phone}`}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Telefon
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
      </div>
    </div>
  );
} 