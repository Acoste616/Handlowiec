'use client';

import { useState } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  specialization: string;
}

export default function ClientContactPage() {
  const { user } = useClientAuth();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Bartek Nowak',
      role: 'Senior Sales Manager',
      email: 'bartek.nowak@bezhandlowca.pl',
      phone: '+48 123 456 789',
      avatar: 'BN',
      status: 'online',
      specialization: 'Rozwiązania enterprise, CRM, automatyzacja'
    },
    {
      id: '2',
      name: 'Marta Kowalska',
      role: 'Account Manager',
      email: 'marta.kowalska@bezhandlowca.pl',
      phone: '+48 987 654 321',
      avatar: 'MK',
      status: 'online',
      specialization: 'Onboarding, wsparcie klientów, szkolenia'
    },
    {
      id: '3',
      name: 'Tomasz Wiśniewski',
      role: 'Technical Consultant',
      email: 'tomasz.wisniewski@bezhandlowca.pl',
      phone: '+48 555 777 888',
      avatar: 'TW',
      status: 'busy',
      specialization: 'Integracje, API, rozwiązania techniczne'
    }
  ];

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'Dostępny';
      case 'offline': return 'Niedostępny';
      case 'busy': return 'Zajęty';
      default: return 'Nieznany';
    }
  };

  const handleSendMessage = async () => {
    if (!selectedMember || !subject || !message) return;

    try {
      // Symulacja wysłania wiadomości
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setMessage('');
      setSubject('');
      setShowMessageModal(false);
      setSelectedMember(null);
      
      alert('Wiadomość została wysłana!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Błąd podczas wysyłania wiadomości');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kontakt z Zespołem</h1>
              <p className="text-sm text-gray-500">
                Skontaktuj się z Twoim zespołem handlowym
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="text-3xl text-blue-500 mr-4">📞</div>
              <div>
                <h3 className="font-semibold text-gray-900">Pilny kontakt</h3>
                <p className="text-sm text-gray-600">Zadzwoń bezpośrednio</p>
              </div>
            </div>
            <a
              href="tel:+48123456789"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center block"
            >
              Zadzwoń teraz
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="text-3xl text-green-500 mr-4">💬</div>
              <div>
                <h3 className="font-semibold text-gray-900">Chat online</h3>
                <p className="text-sm text-gray-600">Szybka pomoc</p>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Rozpocznij chat
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="text-3xl text-purple-500 mr-4">📅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Umów spotkanie</h3>
                <p className="text-sm text-gray-600">Zaplanuj konsultację</p>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Zarezerwuj termin
            </button>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Twój zespół handlowy</h3>
            <p className="text-sm text-gray-600">Poznaj osoby, które pracują nad Twoimi projektami</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{member.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.specialization}</p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'online' ? 'bg-green-100 text-green-800' :
                          member.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(member.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <a
                      href={`tel:${member.phone}`}
                      className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                      title="Zadzwoń"
                    >
                      📞
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                      title="Wyślij email"
                    >
                      ✉️
                    </a>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowMessageModal(true);
                      }}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
                    >
                      Wyślij wiadomość
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Często zadawane pytania</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Jak mogę śledzić postępy moich leadów?</h4>
              <p className="text-gray-600 text-sm">
                Możesz śledzić postępy w sekcji "Moje Leady" oraz "Lejek Sprzedaży". 
                Wszystkie aktualizacje są widoczne w czasie rzeczywistym.
              </p>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Jak długo trwa proces sprzedaży?</h4>
              <p className="text-gray-600 text-sm">
                Średni czas realizacji to 45 dni, ale może się różnić w zależności od 
                złożoności projektu i szybkości podejmowania decyzji.
              </p>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Co się dzieje po akceptacji oferty?</h4>
              <p className="text-gray-600 text-sm">
                Po akceptacji oferty, Twój Account Manager skontaktuje się z Tobą w ciągu 24 godzin 
                w celu omówienia kolejnych kroków i harmonogramu wdrożenia.
              </p>
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {showMessageModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wiadomość do {selectedMember.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temat</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    placeholder="Wprowadź temat wiadomości"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wiadomość</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    placeholder="Napisz swoją wiadomość..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setSelectedMember(null);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!subject || !message}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Wyślij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 