'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Message {
  id: string;
  type: 'chat' | 'notification' | 'announcement';
  from: string;
  fromRole: 'account_manager' | 'system' | 'client';
  subject?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
}

export default function ClientMessagesPage() {
  const { user } = useClientAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMessages: Message[] = [
        {
          id: '1',
          type: 'chat',
          from: 'Katarzyna Nowak',
          fromRole: 'account_manager',
          content: 'Dzień dobry! Sprawdziłam raport z wczoraj - świetne wyniki! Marta wykonała doskonałą robotę z leadem TechFlow. Czy mają Państwo jakieś pytania dotyczące nowych leadów?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isImportant: false
        },
        {
          id: '2',
          type: 'notification',
          from: 'System BezHandlowca',
          fromRole: 'system',
          subject: 'Nowy lead wysokiej wartości',
          content: 'Właśnie otrzymaliśmy nowy lead od firmy "DataCorp Solutions" z szacunkową wartością 150,000 zł. Lead został automatycznie przypisany do Bartka Nowaka.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isImportant: true
        },
        {
          id: '3',
          type: 'announcement',
          from: 'BezHandlowca.pl',
          fromRole: 'system',
          subject: 'Nowe funkcje w panelu klienta',
          content: 'Wprowadziliśmy nowe funkcje: podgląd nagrań rozmów w czasie rzeczywistym i możliwość dołączenia do aktywnych rozmów. Funkcje dostępne od dzisiaj!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isImportant: false
        },
        {
          id: '4',
          type: 'chat',
          from: 'Katarzyna Nowak',
          fromRole: 'account_manager',
          content: 'Czy chcieliby Państwo umówić się na call review tego tygodnia? Mamy kilka ciekawych leadów do omówienia i chciałabym przedstawić propozycje optymalizacji.',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isImportant: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'important') return message.isImportant;
    return true;
  });

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      type: 'chat',
      from: user?.companyName || 'Klient',
      fromRole: 'client',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      isImportant: false
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const getMessageIcon = (type: Message['type'], fromRole: Message['fromRole']) => {
    if (type === 'chat') return fromRole === 'client' ? '👤' : '👨‍💼';
    if (type === 'notification') return '🔔';
    if (type === 'announcement') return '📢';
    return '💬';
  };

  const getMessageTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'chat': return 'border-l-blue-500';
      case 'notification': return 'border-l-orange-500';
      case 'announcement': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie wiadomości...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Wiadomości
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              >
                <option value="all">Wszystkie</option>
                <option value="unread">Nieprzeczytane</option>
                <option value="important">Ważne</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* New Message Form */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Napisz do Account Managera
                </h3>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Twoja wiadomość..."
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Wyślij
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y divide-gray-200">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Brak wiadomości do wyświetlenia
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) markAsRead(message.id);
                      }}
                      className={`p-6 cursor-pointer hover:bg-gray-50 border-l-4 ${getMessageTypeColor(message.type)} ${
                        !message.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{getMessageIcon(message.type, message.fromRole)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.from}
                              </p>
                              {message.isImportant && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                  Ważne
                                </span>
                              )}
                              {!message.isRead && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Nowe
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(message.timestamp), 'dd.MM HH:mm', { locale: pl })}
                            </span>
                          </div>
                          {message.subject && (
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {message.subject}
                            </p>
                          )}
                          <p className={`text-sm mt-1 line-clamp-2 ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statystyki</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wszystkie wiadomości</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nieprzeczytane</span>
                  <span className="font-medium text-blue-600">
                    {messages.filter(m => !m.isRead).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ważne</span>
                  <span className="font-medium text-red-600">
                    {messages.filter(m => m.isImportant).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Twój Account Manager</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">KN</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Katarzyna Nowak</p>
                  <p className="text-sm text-gray-500">katarzyna@bezhandlowca.pl</p>
                  <p className="text-sm text-gray-500">+48 123 456 789</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-primary-700">
                  📞 Zadzwoń
                </button>
                <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                  📅 Umów spotkanie
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  📊 Zamów raport tygodniowy
                </button>
                <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                  🎯 Zgłoś nowy lead
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                  💡 Zaproponuj ulepszenie
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getMessageIcon(selectedMessage.type, selectedMessage.fromRole)}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedMessage.from}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(selectedMessage.timestamp), 'dd MMMM yyyy, HH:mm', { locale: pl })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedMessage.subject && (
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {selectedMessage.subject}
                  </h4>
                )}

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {selectedMessage.fromRole !== 'client' && (
                  <div className="mt-6 flex space-x-3">
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                      Odpowiedz
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                      Przekaż dalej
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 