'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface Lead {
  id: string;
  type: 'private' | 'company';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  nip?: string;
  industry?: string;
  companySize?: string;
  position?: string;
  decisionMaker?: string;
  budget: string;
  timeline: string;
  currentSolution?: string;
  painPoints: string[];
  expectedROI?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  assignedAgent?: string;
  score: number;
  priority: 'low' | 'medium' | 'high';
}

export default function SuperAdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Lead['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Lead['type']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Lead['priority']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setError(null);
      
      // Pobierz prawdziwe leady z API
      const response = await fetch('/api/super-admin/leads');
      const result = await response.json();

      if (result.success) {
        setLeads(result.data || []);
      } else {
        // Fallback do mock danych jeśli API nie działa
        const mockLeads: Lead[] = [
          {
            id: '1',
            type: 'company',
            firstName: 'Anna',
            lastName: 'Kowalska',
            email: 'anna@techcorp.pl',
            phone: '+48 123 456 789',
            companyName: 'TechCorp Solutions',
            nip: '1234567890',
            industry: 'it',
            companySize: '51-200',
            position: 'Dyrektor IT',
            decisionMaker: 'decision-maker',
            budget: '50000-100000',
            timeline: '3-months',
            currentSolution: 'Excel + email',
            painPoints: ['Brak systemu CRM', 'Trudności w zarządzaniu leadami', 'Problemy z raportowaniem'],
            expectedROI: '12-months',
            message: 'Szukamy kompleksowego rozwiązania CRM dla naszego zespołu sprzedażowego...',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'new',
            assignedAgent: undefined,
            score: 92,
            priority: 'high'
          },
          {
            id: '2',
            type: 'company',
            firstName: 'Piotr',
            lastName: 'Nowak',
            email: 'piotr@startup.pl',
            phone: '+48 987 654 321',
            companyName: 'StartupFlow',
            nip: '0987654321',
            industry: 'consulting',
            companySize: '11-50',
            position: 'CEO',
            decisionMaker: 'decision-maker',
            budget: '15000-30000',
            timeline: '1-month',
            currentSolution: 'Brak systemu',
            painPoints: ['Brak systemu CRM', 'Słaba komunikacja z klientami'],
            expectedROI: '6-months',
            message: 'Potrzebujemy prostego CRM do zarządzania klientami...',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'contacted',
            assignedAgent: 'Jan Kowalski',
            score: 78,
            priority: 'medium'
          },
          {
            id: '3',
            type: 'private',
            firstName: 'Maria',
            lastName: 'Wiśniewska',
            email: 'maria@example.com',
            phone: '+48 555 666 777',
            budget: '5000-15000',
            timeline: 'planning',
            currentSolution: 'Notatnik',
            painPoints: ['Brak automatyzacji procesów'],
            message: 'Prowadzę małą działalność i potrzebuję pomocy w organizacji...',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'qualified',
            assignedAgent: 'Anna Nowak',
            score: 45,
            priority: 'low'
          }
        ];

        setLeads(mockLeads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Błąd podczas ładowania leadów');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLeadScore = (lead: Lead): number => {
    let score = 0;
    
    // Budżet (30 punktów)
    const budgetScores: { [key: string]: number } = {
      '5000-15000': 10,
      '15000-30000': 15,
      '30000-50000': 20,
      '50000-100000': 25,
      '100000+': 30
    };
    score += budgetScores[lead.budget] || 0;

    // Timeline (20 punktów)
    const timelineScores: { [key: string]: number } = {
      'asap': 20,
      '1-month': 18,
      '3-months': 15,
      '6-months': 10,
      'planning': 5
    };
    score += timelineScores[lead.timeline] || 0;

    // Typ klienta i wielkość firmy (25 punktów)
    if (lead.type === 'company') {
      const sizeScores: { [key: string]: number } = {
        '1-10': 10,
        '11-50': 15,
        '51-200': 20,
        '201-500': 23,
        '500+': 25
      };
      score += sizeScores[lead.companySize || ''] || 0;
    } else {
      score += 8; // Klient prywatny
    }

    // Rola w procesie decyzyjnym (15 punktów)
    if (lead.decisionMaker) {
      const decisionScores: { [key: string]: number } = {
        'decision-maker': 15,
        'influencer': 12,
        'evaluator': 8,
        'user': 5
      };
      score += decisionScores[lead.decisionMaker] || 0;
    }

    // Pain points (10 punktów)
    score += Math.min(lead.painPoints.length * 2, 10);

    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Nowy';
      case 'contacted': return 'Skontaktowany';
      case 'qualified': return 'Zakwalifikowany';
      case 'proposal': return 'Oferta';
      case 'closed': return 'Zamknięty';
      case 'lost': return 'Stracony';
      default: return status;
    }
  };

  const filteredLeads = leads.filter(lead => 
    (filterStatus === 'all' || lead.status === filterStatus) &&
    (filterType === 'all' || lead.type === filterType) &&
    (filterPriority === 'all' || lead.priority === filterPriority) &&
    (searchQuery === '' || 
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())))
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
            <div className="flex items-center">
              <Link
                href="/super-admin"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Wróć
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">🎯 Leady z formularza</h1>
                <p className="text-sm text-gray-500">
                  Zarządzaj leadami z formularza kontaktowego
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Łącznie: {leads.length} leadów
              </span>
              <Link
                href="/super-admin/leads/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                ➕ Dodaj lead
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Nowe leady</h3>
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter(l => l.status === 'new').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Wysokie score</h3>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.score >= 80).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Firmy</h3>
            <p className="text-2xl font-bold text-purple-600">
              {leads.filter(l => l.type === 'company').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Średnie score</h3>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Szukaj po imieniu, nazwisku, firmie lub emailu..."
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
                <option value="closed">Zamknięte</option>
                <option value="lost">Stracone</option>
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
                <option value="company">Firmy</option>
                <option value="private">Prywatni</option>
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
                    Score / Priorytet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budżet / Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data utworzenia
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
                      <div className="text-gray-400 text-6xl mb-4">🎯</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak leadów</h3>
                      <p className="text-gray-500">
                        {searchQuery !== '' || filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
                          ? 'Nie znaleziono leadów o wybranych kryteriach.'
                          : 'Nie ma jeszcze żadnych leadów z formularza.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </div>
                            {lead.companyName && (
                              <div className="text-sm text-gray-500">{lead.companyName}</div>
                            )}
                            <div className="text-xs text-gray-400">
                              {lead.email} • {lead.phone}
                            </div>
                            {lead.type === 'company' && (
                              <div className="text-xs text-gray-400">
                                {lead.position} • {lead.industry}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                            {lead.score}/100
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                            {lead.priority === 'high' ? 'Wysoki' :
                             lead.priority === 'medium' ? 'Średni' : 'Niski'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {lead.budget.replace('-', ' - ')} zł
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.timeline === 'asap' ? 'ASAP' :
                           lead.timeline === '1-month' ? '1 miesiąc' :
                           lead.timeline === '3-months' ? '3 miesiące' :
                           lead.timeline === '6-months' ? '6 miesięcy' : 'Planowanie'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                        {lead.assignedAgent && (
                          <div className="text-xs text-gray-500 mt-1">
                            Agent: {lead.assignedAgent}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(lead.createdAt), 'd MMM yyyy', { locale: pl })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(lead.createdAt), 'HH:mm', { locale: pl })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/super-admin/leads/${lead.id}`}
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