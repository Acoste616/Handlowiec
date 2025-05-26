'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  estimatedValue: number | null;
  createdAt: string;
  updatedAt: string;
  notes: string;
  score: number;
  
  // Qualification data
  industry?: string;
  companySize?: string;
  position?: string;
  decisionMaker?: string;
  budget?: string;
  timeline?: string;
  expectedROI?: string;
  currentSolution?: string;
  painPoints?: string[];
  teamSize?: string;
  currentResults?: string;
  mainGoals?: string[];
  priorityAreas?: string[];
  successMetrics?: string;
  previousExperience?: string;
  specificRequirements?: string;
  qualifiedAt?: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  timestamp: string;
  user: string;
}

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockLead: Lead = {
        id: leadId,
        firstName: 'Jan',
        lastName: 'Kowalski',
        company: 'TechCorp Sp. z o.o.',
        email: 'jan@techcorp.pl',
        phone: '+48 123 456 789',
        message: 'Interesuje mnie system CRM dla mojej firmy. Mamy około 50 pracowników i potrzebujemy rozwiązania do zarządzania leadami.',
        source: 'website',
        status: 'qualified',
        priority: 'high',
        assignedTo: 'bartek@bezhandlowca.pl',
        estimatedValue: 75000,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        notes: 'Klient bardzo zainteresowany. Umówione demo na przyszły tydzień.',
        score: 85
      };

      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'status_change',
          description: 'Status zmieniony z "new" na "contacted"',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Bartek Nowak'
        },
        {
          id: '2',
          type: 'call',
          description: 'Rozmowa telefoniczna - 15 minut. Omówione potrzeby klienta.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          user: 'Bartek Nowak'
        },
        {
          id: '3',
          type: 'email',
          description: 'Wysłane materiały informacyjne o systemie CRM',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Bartek Nowak'
        },
        {
          id: '4',
          type: 'status_change',
          description: 'Status zmieniony z "contacted" na "qualified"',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          user: 'Bartek Nowak'
        }
      ];

      setLead(mockLead);
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      setError('Błąd podczas ładowania szczegółów leada');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    try {
      setIsSaving(true);
      
      // Symulacja zapisywania
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving lead:', lead);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving lead:', error);
      setError('Błąd podczas zapisywania');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: 'note',
        description: newNote,
        timestamp: new Date().toISOString(),
        user: 'Administrator'
      };

      setActivities(prev => [newActivity, ...prev]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '✉️';
      case 'meeting': return '🤝';
      case 'note': return '📝';
      case 'status_change': return '🔄';
      default: return '📋';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów leada...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Błąd</h2>
          <p className="text-gray-600 mb-4">{error || 'Lead nie został znaleziony'}</p>
          <Link
            href="/super-admin/leads"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Wróć do listy leadów
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
                href="/super-admin/leads"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Wróć
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  {lead.firstName} {lead.lastName}
                </h1>
                <p className="text-sm text-gray-500">{lead.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                Score: {lead.score}
              </span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edytuj
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje podstawowe</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <span className="text-gray-900">{lead.email}</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="ml-2 text-blue-600 hover:text-blue-700"
                    >
                      ✉️
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <div className="flex items-center">
                    <span className="text-gray-900">{lead.phone}</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="ml-2 text-green-600 hover:text-green-700"
                    >
                      📞
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Źródło</label>
                  <span className="text-gray-900 capitalize">{lead.source}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data utworzenia</label>
                  <span className="text-gray-900">
                    {format(new Date(lead.createdAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Wiadomość</label>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                  {lead.message}
                </div>
              </div>
            </div>

            {/* Lead Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Zarządzanie leadem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {isEditing ? (
                    <select
                      value={lead.status}
                      onChange={(e) => setLead({...lead, status: e.target.value as any})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="new">Nowy</option>
                      <option value="contacted">Skontaktowany</option>
                      <option value="qualified">Zakwalifikowany</option>
                      <option value="proposal">Oferta</option>
                      <option value="closed">Zamknięty</option>
                      <option value="lost">Stracony</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorytet</label>
                  {isEditing ? (
                    <select
                      value={lead.priority}
                      onChange={(e) => setLead({...lead, priority: e.target.value as any})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="low">Niski</option>
                      <option value="medium">Średni</option>
                      <option value="high">Wysoki</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Przypisany do</label>
                  {isEditing ? (
                    <select
                      value={lead.assignedTo}
                      onChange={(e) => setLead({...lead, assignedTo: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Nie przypisany</option>
                      <option value="admin@bezhandlowca.pl">Administrator</option>
                      <option value="bartek@bezhandlowca.pl">Bartek Nowak</option>
                      <option value="marta@bezhandlowca.pl">Marta Kowalska</option>
                    </select>
                  ) : (
                    <span className="text-gray-900">{lead.assignedTo || 'Nie przypisany'}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wartość szacunkowa</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={lead.estimatedValue || ''}
                      onChange={(e) => setLead({...lead, estimatedValue: e.target.value ? Number(e.target.value) : null})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="50000"
                    />
                  ) : (
                    <span className="text-gray-900">
                      {lead.estimatedValue ? `${lead.estimatedValue.toLocaleString()} zł` : 'Nie określono'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notatki</label>
                {isEditing ? (
                  <textarea
                    value={lead.notes}
                    onChange={(e) => setLead({...lead, notes: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Dodaj notatki..."
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                    {lead.notes || 'Brak notatek'}
                  </div>
                )}
              </div>
            </div>

            {/* Qualification Data */}
            {lead.industry && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dane kwalifikacyjne</h3>
                
                {/* Business Information */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Informacje biznesowe</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lead.industry && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branża</label>
                        <span className="text-gray-900 capitalize">{lead.industry}</span>
                      </div>
                    )}
                    {lead.companySize && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wielkość firmy</label>
                        <span className="text-gray-900">{lead.companySize} pracowników</span>
                      </div>
                    )}
                    {lead.position && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stanowisko</label>
                        <span className="text-gray-900">{lead.position}</span>
                      </div>
                    )}
                    {lead.decisionMaker && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rola decyzyjna</label>
                        <span className="text-gray-900">
                          {lead.decisionMaker === 'decision-maker' ? 'Decydent' :
                           lead.decisionMaker === 'influencer' ? 'Wpływa na decyzje' :
                           lead.decisionMaker === 'evaluator' ? 'Ocenia rozwiązania' : 'Użytkownik końcowy'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Budżet i timeline</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lead.budget && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budżet miesięczny</label>
                        <span className="text-gray-900">{lead.budget.replace('-', ' - ')} zł</span>
                      </div>
                    )}
                    {lead.timeline && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                        <span className="text-gray-900">
                          {lead.timeline === 'asap' ? 'Jak najszybciej' :
                           lead.timeline === '1-month' ? 'W ciągu miesiąca' :
                           lead.timeline === '3-months' ? 'W ciągu 3 miesięcy' :
                           lead.timeline === '6-months' ? 'W ciągu 6 miesięcy' : 'Planowanie'}
                        </span>
                      </div>
                    )}
                    {lead.expectedROI && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Oczekiwany ROI</label>
                        <span className="text-gray-900">
                          {lead.expectedROI === '3-months' ? 'Zwrot w 3 miesiące' :
                           lead.expectedROI === '6-months' ? 'Zwrot w 6 miesięcy' :
                           lead.expectedROI === '12-months' ? 'Zwrot w 12 miesięcy' :
                           lead.expectedROI === '18-months' ? 'Zwrot w 18 miesięcy' : 'Długoterminowa inwestycja'}
                        </span>
                      </div>
                    )}
                    {lead.teamSize && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zespół sprzedażowy</label>
                        <span className="text-gray-900">{lead.teamSize}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Situation */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Obecna sytuacja</h4>
                  {lead.currentSolution && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Obecne rozwiązanie</label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                        {lead.currentSolution}
                      </div>
                    </div>
                  )}
                  {lead.painPoints && lead.painPoints.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Główne problemy</label>
                      <div className="flex flex-wrap gap-2">
                        {lead.painPoints.map((point, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {lead.currentResults && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Obecne wyniki</label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                        {lead.currentResults}
                      </div>
                    </div>
                  )}
                </div>

                {/* Goals & Expectations */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Cele i oczekiwania</h4>
                  {lead.mainGoals && lead.mainGoals.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Główne cele</label>
                      <div className="flex flex-wrap gap-2">
                        {lead.mainGoals.map((goal, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {lead.successMetrics && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Metryki sukcesu</label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                        {lead.successMetrics}
                      </div>
                    </div>
                  )}
                  {lead.previousExperience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poprzednie doświadczenia</label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                        {lead.previousExperience}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {lead.specificRequirements && (
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-3">Dodatkowe informacje</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specjalne wymagania</label>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                        {lead.specificRequirements}
                      </div>
                    </div>
                  </div>
                )}

                {lead.qualifiedAt && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Zakwalifikowany: {format(new Date(lead.qualifiedAt), 'dd MMM yyyy, HH:mm', { locale: pl })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Szybkie akcje</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${lead.phone}`}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                >
                  📞 Zadzwoń
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                >
                  ✉️ Wyślij email
                </a>
                <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-sm">
                  🤝 Zaplanuj spotkanie
                </button>
              </div>
            </div>

            {/* Add Note */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dodaj notatkę</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Wpisz notatkę..."
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className={`mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm ${
                  !newNote.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Dodaj notatkę
              </button>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historia aktywności</h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(activity.timestamp), 'dd MMM, HH:mm', { locale: pl })} • {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 