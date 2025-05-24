'use client';

import { useState } from 'react';
import { useClientAuth } from '@/hooks/useClientAuth';

export default function ClientSettingsPage() {
  const { user } = useClientAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'branding' | 'integrations'>('profile');

  const tabs = [
    { key: 'profile', label: 'Profil firmy', icon: '🏢' },
    { key: 'notifications', label: 'Powiadomienia', icon: '🔔' },
    { key: 'branding', label: 'Branding', icon: '🎨' },
    { key: 'integrations', label: 'Integracje', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Ustawienia - {user?.companyName}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {tabs.find(t => t.key === activeTab)?.label}
              </h2>
              
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Zarządzaj podstawowymi informacjami o firmie.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nazwa firmy
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.companyName}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email kontaktowy
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Konfiguruj powiadomienia o ważnych wydarzeniach.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Nowe leady
                        </label>
                        <p className="text-xs text-gray-500">
                          Otrzymuj powiadomienia o nowych leadach
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Dostosuj wygląd panelu do Twojej marki.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo firmy
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-500">Przeciągnij logo tutaj lub kliknij aby wybrać</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <p className="text-gray-600">Połącz z zewnętrznymi systemami.</p>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Webhook URL</h4>
                          <p className="text-sm text-gray-500">Otrzymuj powiadomienia o zdarzeniach</p>
                        </div>
                        <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm">
                          Konfiguruj
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                  Zapisz zmiany
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 