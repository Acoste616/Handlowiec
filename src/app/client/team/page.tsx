'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { clientApiClient } from '@/utils/clientApi';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'in_call' | 'break';
  currentActivity?: string;
  todayStats: {
    callsMade: number;
    emailsSent: number;
    conversationsHeld: number;
    leadsInPipeline: number;
    workingHours: number;
  };
  performance: {
    closingRate: number;
    avgResponseTime: number; // in minutes
    totalDealsValue: number;
    leadsThisMonth: number;
  };
  schedule: {
    startTime: string;
    endTime: string;
    timezone: string;
    nextMeeting?: {
      time: string;
      client: string;
      type: 'call' | 'meeting' | 'demo';
    };
  };
  recentActivity: Activity[];
  availability: 'available' | 'busy' | 'away';
  skills: string[];
  languages: string[];
}

interface Activity {
  id: string;
  timestamp: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'lead_assigned';
  description: string;
  leadName?: string;
  duration?: number;
  outcome?: string;
}

export default function ClientTeamPage() {
  const { user } = useClientAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScreenShareModal, setShowScreenShareModal] = useState(false);
  const [screenShareMember, setScreenShareMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchTeamData, 30000);
    
    return () => clearInterval(interval);
  }, [selectedDate]);

  const fetchTeamData = async () => {
    try {
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Bartek Nowak',
          email: 'bartek@bezhandlowca.pl',
          status: 'in_call',
          currentActivity: 'Rozmowa z Kowalski Sp. z o.o.',
          todayStats: {
            callsMade: 12,
            emailsSent: 8,
            conversationsHeld: 7,
            leadsInPipeline: 15,
            workingHours: 6.5
          },
          performance: {
            closingRate: 24.2,
            avgResponseTime: 8,
            totalDealsValue: 320000,
            leadsThisMonth: 38
          },
          schedule: {
            startTime: '08:00',
            endTime: '16:00',
            timezone: 'Europe/Warsaw',
            nextMeeting: {
              time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              client: 'TechFlow Solutions',
              type: 'demo'
            }
          },
          recentActivity: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              type: 'call',
              description: 'Rozpoczęto rozmowę',
              leadName: 'Jan Kowalski',
              duration: 0
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              type: 'email',
              description: 'Wysłano follow-up',
              leadName: 'Anna Nowak'
            }
          ],
          availability: 'busy',
          skills: ['B2B Sales', 'SaaS', 'Negocjacje'],
          languages: ['Polski', 'Angielski']
        },
        {
          id: '2',
          name: 'Marta Kowalska',
          email: 'marta@bezhandlowca.pl',
          status: 'online',
          currentActivity: 'Przegląd leadów',
          todayStats: {
            callsMade: 15,
            emailsSent: 12,
            conversationsHeld: 9,
            leadsInPipeline: 18,
            workingHours: 7.2
          },
          performance: {
            closingRate: 28.5,
            avgResponseTime: 6,
            totalDealsValue: 380000,
            leadsThisMonth: 42
          },
          schedule: {
            startTime: '09:00',
            endTime: '17:00',
            timezone: 'Europe/Warsaw',
            nextMeeting: {
              time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
              client: 'ProBiznes',
              type: 'call'
            }
          },
          recentActivity: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              type: 'lead_assigned',
              description: 'Nowy lead przypisany',
              leadName: 'Piotr Wiśniewski'
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              type: 'call',
              description: 'Zakończono rozmowę',
              leadName: 'Maria Zawadzka',
              duration: 22,
              outcome: 'Positive'
            }
          ],
          availability: 'available',
          skills: ['Lead Generation', 'CRM', 'Customer Success'],
          languages: ['Polski', 'Angielski', 'Niemiecki']
        },
        {
          id: '3',
          name: 'Tomasz Wiśniewski',
          email: 'tomasz@bezhandlowca.pl',
          status: 'break',
          currentActivity: 'Przerwa obiadowa',
          todayStats: {
            callsMade: 8,
            emailsSent: 6,
            conversationsHeld: 5,
            leadsInPipeline: 12,
            workingHours: 4.5
          },
          performance: {
            closingRate: 21.1,
            avgResponseTime: 10,
            totalDealsValue: 285000,
            leadsThisMonth: 35
          },
          schedule: {
            startTime: '10:00',
            endTime: '18:00',
            timezone: 'Europe/Warsaw'
          },
          recentActivity: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              type: 'meeting',
              description: 'Deal closure meeting',
              leadName: 'ProSoft',
              duration: 45,
              outcome: 'Closed - Won'
            }
          ],
          availability: 'away',
          skills: ['Enterprise Sales', 'Closing', 'Relationship Building'],
          languages: ['Polski', 'Angielski']
        }
      ];

      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError('Błąd podczas pobierania danych zespołu');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'in_call': return 'bg-blue-100 text-blue-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'Dostępny';
      case 'offline': return 'Offline';
      case 'in_call': return 'W rozmowie';
      case 'break': return 'Przerwa';
      default: return status;
    }
  };

  const getStatusIndicator = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'offline': return 'bg-gray-400';
      case 'in_call': return 'bg-blue-400 animate-pulse';
      case 'break': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getAvailabilityColor = (availability: TeamMember['availability']) => {
    switch (availability) {
      case 'available': return 'text-green-600';
      case 'busy': return 'text-red-600';
      case 'away': return 'text-yellow-600';
      default: return 'text-gray-600';
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

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '✉️';
      case 'meeting': return '🤝';
      case 'note': return '📝';
      case 'lead_assigned': return '🎯';
      default: return '📋';
    }
  };

  const handleScreenShare = (member: TeamMember) => {
    setScreenShareMember(member);
    setShowScreenShareModal(true);
  };

  const totalCallsToday = teamMembers.reduce((sum, member) => sum + member.todayStats.callsMade, 0);
  const totalEmailsToday = teamMembers.reduce((sum, member) => sum + member.todayStats.emailsSent, 0);
  const activeMembers = teamMembers.filter(member => member.status !== 'offline').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie danych zespołu...</p>
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
              Aktywność Zespołu
            </h1>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </div>
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

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aktywni handlowcy</p>
                <p className="text-2xl font-bold text-green-600">{activeMembers}/{teamMembers.length}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Telefony dziś</p>
                <p className="text-2xl font-bold text-blue-600">{totalCallsToday}</p>
              </div>
              <div className="text-3xl">📞</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Emaile dziś</p>
                <p className="text-2xl font-bold text-purple-600">{totalEmailsToday}</p>
              </div>
              <div className="text-3xl">✉️</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Śr. konwersja</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(teamMembers.reduce((sum, m) => sum + m.performance.closingRate, 0) / teamMembers.length).toFixed(1)}%
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusIndicator(member.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Zobacz więcej
                </button>
              </div>

              {/* Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                  <span className={`text-xs font-medium ${getAvailabilityColor(member.availability)}`}>
                    {member.availability === 'available' ? 'Dostępny' :
                     member.availability === 'busy' ? 'Zajęty' : 'Nieobecny'}
                  </span>
                </div>
                {member.currentActivity && (
                  <p className="text-sm text-gray-600 mt-2">{member.currentActivity}</p>
                )}
              </div>

              {/* Today's Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-gray-900">{member.todayStats.callsMade}</p>
                  <p className="text-xs text-gray-500">Telefony</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-gray-900">{member.todayStats.conversationsHeld}</p>
                  <p className="text-xs text-gray-500">Rozmowy</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-gray-900">{member.todayStats.emailsSent}</p>
                  <p className="text-xs text-gray-500">Emaile</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-gray-900">{member.todayStats.leadsInPipeline}</p>
                  <p className="text-xs text-gray-500">Pipeline</p>
                </div>
              </div>

              {/* Performance */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Konwersja:</span>
                  <span className="font-medium">{member.performance.closingRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Śr. czas reakcji:</span>
                  <span className="font-medium">{member.performance.avgResponseTime} min</span>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Godziny pracy:</span>
                  <span className="font-medium">{member.schedule.startTime} - {member.schedule.endTime}</span>
                </div>
                {member.schedule.nextMeeting && (
                  <div className="text-sm text-blue-600 mt-1">
                    Następne: {format(new Date(member.schedule.nextMeeting.time), 'HH:mm')} - {member.schedule.nextMeeting.client}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleScreenShare(member)}
                  disabled={member.status === 'offline'}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  👁️ Podgląd
                </button>
                <button
                  disabled={member.availability !== 'available'}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💬 Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Member Details Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    Szczegóły - {selectedMember.name}
                  </h3>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Performance Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Wydajność tego miesiąca</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Leady w miesiącu:</span>
                        <span className="font-medium">{selectedMember.performance.leadsThisMonth}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Wartość dealów:</span>
                        <span className="font-medium">{formatCurrency(selectedMember.performance.totalDealsValue)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Skuteczność:</span>
                        <span className="font-medium">{selectedMember.performance.closingRate}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Średni czas reakcji:</span>
                        <span className="font-medium">{selectedMember.performance.avgResponseTime} min</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-4 mt-8">Umiejętności</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-medium text-gray-900 mb-4 mt-6">Języki</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Ostatnia aktywność</h4>
                    <div className="space-y-4">
                      {selectedMember.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                          <div className="text-lg">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.description}
                              </p>
                              <span className="text-xs text-gray-500">
                                {format(new Date(activity.timestamp), 'HH:mm')}
                              </span>
                            </div>
                            {activity.leadName && (
                              <p className="text-sm text-gray-600">{activity.leadName}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              {activity.duration && (
                                <span>Czas: {activity.duration} min</span>
                              )}
                              {activity.outcome && (
                                <span className={`${
                                  activity.outcome.includes('Positive') || activity.outcome.includes('Won')
                                    ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {activity.outcome}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleScreenShare(selectedMember)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        👁️ Poproś o podgląd ekranu
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                        💬 Wyślij wiadomość
                      </button>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                        📊 Pełny raport
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen Share Modal */}
        {showScreenShareModal && screenShareMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Prośba o podgląd ekranu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Czy chcesz poprosić <strong>{screenShareMember.name}</strong> o udostępnienie ekranu?
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Handlowiec otrzyma powiadomienie z prośbą o rozpoczęcie screen share. 
                  Może zaakceptować lub odrzucić prośbę.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowScreenShareModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => {
                      // Handle screen share request
                      setShowScreenShareModal(false);
                      setScreenShareMember(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Wyślij prośbę
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktywność na żywo</h3>
          <div className="space-y-3">
            {teamMembers.flatMap(member => 
              member.recentActivity.slice(0, 1).map(activity => ({
                ...activity,
                memberName: member.name,
                memberId: member.id
              }))
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)
            .map((activity) => (
              <div key={`${activity.memberId}-${activity.id}`} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.memberName} - {activity.description}
                    </p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  {activity.leadName && (
                    <p className="text-sm text-gray-600">{activity.leadName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 