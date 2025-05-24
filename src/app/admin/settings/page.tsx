'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  defaultLeadStatus: string;
  emailNotifications: boolean;
  slackNotifications: boolean;
  autoAssignment: boolean;
  leadRetentionDays: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  active: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'notifications' | 'integrations'>('general');
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'BezHandlowca.pl',
    companyEmail: 'kontakt@bezhandlowca.pl',
    companyPhone: '+48 123 456 789',
    defaultLeadStatus: 'new',
    emailNotifications: true,
    slackNotifications: true,
    autoAssignment: false,
    leadRetentionDays: 365
  });
  
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Administrator',
      email: 'admin@bezhandlowca.pl',
      role: 'admin',
      active: true
    },
    {
      id: '2',
      name: 'Bartek Nowak',
      email: 'bartek@bezhandlowca.pl',
      role: 'user',
      active: true
    },
    {
      id: '3',
      name: 'Marta Kowalska',
      email: 'marta@bezhandlowca.pl',
      role: 'user',
      active: true
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Ustawienia zostały zapisane pomyślnie!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage('Błąd podczas zapisywania ustawień');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { key: 'general', label: 'Ogólne', icon: '⚙️' },
    { key: 'users', label: 'Użytkownicy', icon: '👥' },
    { key: 'notifications', label: 'Powiadomienia', icon: '🔔' },
    { key: 'integrations', label: 'Integracje', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Ustawienia Systemu
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            saveMessage.includes('pomyślnie') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'general' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Ustawienia ogólne</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nazwa firmy
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email kontaktowy
                      </label>
                      <input
                        type="email"
                        value={settings.companyEmail}
                        onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon kontaktowy
                      </label>
                      <input
                        type="tel"
                        value={settings.companyPhone}
                        onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domyślny status leada
                      </label>
                      <select
                        value={settings.defaultLeadStatus}
                        onChange={(e) => setSettings({...settings, defaultLeadStatus: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="new">Nowy</option>
                        <option value="contacted">Skontaktowany</option>
                        <option value="qualified">Qualified</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Czas przechowywania leadów (dni)
                      </label>
                      <input
                        type="number"
                        value={settings.leadRetentionDays}
                        onChange={(e) => setSettings({...settings, leadRetentionDays: Number(e.target.value)})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        min="30"
                        max="3650"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Opcje automatyzacji</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="autoAssignment"
                          type="checkbox"
                          checked={settings.autoAssignment}
                          onChange={(e) => setSettings({...settings, autoAssignment: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoAssignment" className="ml-2 block text-sm text-gray-700">
                          Automatyczne przypisywanie nowych leadów
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Zarządzanie użytkownikami</h2>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    Dodaj użytkownika
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Użytkownik
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rola
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akcje
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-sm font-medium">
                                  {userItem.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {userItem.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {userItem.active ? 'Aktywny' : 'Nieaktywny'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                Edytuj
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                {userItem.active ? 'Dezaktywuj' : 'Aktywuj'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Ustawienia powiadomień</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Powiadomienia email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Włącz powiadomienia email
                          </label>
                          <p className="text-xs text-gray-500">
                            Otrzymuj powiadomienia o nowych leadach i aktualizacjach statusu
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Integracja z Slack</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Włącz powiadomienia Slack
                          </label>
                          <p className="text-xs text-gray-500">
                            Wysyłaj powiadomienia do kanału Slack przy aktualizacjach statusu
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.slackNotifications}
                          onChange={(e) => setSettings({...settings, slackNotifications: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>

                      {settings.slackNotifications && (
                        <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Webhook URL Slack
                          </label>
                          <input
                            type="url"
                            placeholder="https://hooks.slack.com/services/..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Częstotliwość powiadomień</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raport dzienny
                        </label>
                        <select className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                          <option value="off">Wyłączony</option>
                          <option value="8:00">8:00</option>
                          <option value="12:00">12:00</option>
                          <option value="18:00">18:00</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Raport tygodniowy
                        </label>
                        <select className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                          <option value="off">Wyłączony</option>
                          <option value="monday">Poniedziałek</option>
                          <option value="friday">Piątek</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Integracje zewnętrzne</h2>
                
                <div className="space-y-8">
                  {/* Google Sheets */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Google Sheets</h3>
                          <p className="text-sm text-gray-500">Synchronizacja leadów z arkuszem kalkulacyjnym</p>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Połączony
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID arkusza Google Sheets
                        </label>
                        <input
                          type="text"
                          value="1ABC123def456ghi789..."
                          readOnly
                          className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Testuj połączenie
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                          Reconnect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email Service */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl">✉️</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Gmail API</h3>
                          <p className="text-sm text-gray-500">Wysyłanie emaili przez Gmail</p>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Aktywny
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email nadawcy
                        </label>
                        <input
                          type="email"
                          value="system@bezhandlowca.pl"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Testuj wysyłanie
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Slack Integration */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl">💬</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Slack</h3>
                          <p className="text-sm text-gray-500">Powiadomienia w kanale zespołu</p>
                        </div>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Konfiguracja
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://hooks.slack.com/services/..."
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kanał
                        </label>
                        <input
                          type="text"
                          placeholder="#leady"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                          Zapisz konfigurację
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Testuj webhook
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    💾 Zapisz ustawienia
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 