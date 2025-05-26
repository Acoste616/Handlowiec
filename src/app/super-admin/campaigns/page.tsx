'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  platform: 'google_ads' | 'facebook' | 'linkedin' | 'tiktok' | 'email';
  targetAudience: string;
  budget: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  leadsGenerated: number;
  costPerLead: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export default function SuperAdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Campaign['status']>('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setError(null);
      
      // Symulacja danych - w produkcji to byłyby prawdziwe API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'CRM dla firm IT - Google Ads',
          platform: 'google_ads',
          targetAudience: 'Firmy IT 50-200 pracowników',
          budget: 15000,
          status: 'active',
          leadsGenerated: 47,
          costPerLead: 319,
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Automatyzacja sprzedaży - LinkedIn',
          platform: 'linkedin',
          targetAudience: 'Dyrektorzy sprzedaży, CEO',
          budget: 8000,
          status: 'active',
          leadsGenerated: 23,
          costPerLead: 348,
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Retargeting - Facebook',
          platform: 'facebook',
          targetAudience: 'Odwiedzający stronę',
          budget: 5000,
          status: 'paused',
          leadsGenerated: 12,
          costPerLead: 417,
          startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          name: 'Email Marketing - Newsletter',
          platform: 'email',
          targetAudience: 'Baza subskrybentów',
          budget: 2000,
          status: 'completed',
          leadsGenerated: 89,
          costPerLead: 22,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Błąd podczas ładowania kampanii');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'google_ads': return '🔍';
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'email': return '📧';
      default: return '📊';
    }
  };

  const getPlatformName = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'google_ads': return 'Google Ads';
      case 'facebook': return 'Facebook';
      case 'linkedin': return 'LinkedIn';
      case 'tiktok': return 'TikTok';
      case 'email': return 'Email';
      default: return platform;
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'paused': return 'Wstrzymana';
      case 'completed': return 'Zakończona';
      case 'draft': return 'Szkic';
      default: return status;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    filterStatus === 'all' || campaign.status === filterStatus
  );

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leadsGenerated, 0);
  const avgCostPerLead = totalLeads > 0 ? totalBudget / totalLeads : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie kampanii...</p>
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
              <h1 className="text-2xl font-bold text-red-600">🚀 Kampanie AI</h1>
              <p className="text-sm text-gray-500">
                Zarządzanie kampaniami pozyskiwania leadów
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/super-admin/campaigns/new"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <span className="mr-2">+</span>
                Nowa kampania
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
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-3xl text-blue-500 mr-4">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Łączny budżet</p>
                <p className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString()} zł</p>
                <p className="text-sm text-gray-500">Wszystkie kampanie</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-3xl text-green-500 mr-4">🎯</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Wygenerowane leady</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-sm text-gray-500">Łącznie</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-3xl text-purple-500 mr-4">💰</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Koszt za lead</p>
                <p className="text-2xl font-bold text-gray-900">{avgCostPerLead.toFixed(0)} zł</p>
                <p className="text-sm text-gray-500">Średnio</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="text-3xl text-orange-500 mr-4">🔥</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Aktywne kampanie</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
                <p className="text-sm text-gray-500">W trakcie</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtruj według statusu:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">Wszystkie</option>
              <option value="active">Aktywne</option>
              <option value="paused">Wstrzymane</option>
              <option value="completed">Zakończone</option>
              <option value="draft">Szkice</option>
            </select>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kampania
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budżet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leady
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Koszt/Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">🚀</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Brak kampanii</h3>
                      <p className="text-gray-500 mb-4">
                        {filterStatus !== 'all' 
                          ? 'Nie znaleziono kampanii o wybranym statusie.'
                          : 'Utwórz pierwszą kampanię, aby rozpocząć pozyskiwanie leadów.'}
                      </p>
                      {filterStatus === 'all' && (
                        <Link
                          href="/super-admin/campaigns/new"
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Utwórz pierwszą kampanię
                        </Link>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.targetAudience}</div>
                          <div className="text-xs text-gray-400">
                            Utworzona: {format(new Date(campaign.createdAt), 'd MMM yyyy', { locale: pl })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getPlatformIcon(campaign.platform)}</span>
                          <span className="text-sm text-gray-900">{getPlatformName(campaign.platform)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.budget.toLocaleString()} zł
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-medium">{campaign.leadsGenerated}</div>
                        <div className="text-xs text-gray-500">leadów</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.costPerLead.toFixed(0)} zł
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/super-admin/campaigns/${campaign.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Zobacz
                          </Link>
                          <Link
                            href={`/super-admin/campaigns/${campaign.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edytuj
                          </Link>
                          {campaign.status === 'active' && (
                            <button className="text-yellow-600 hover:text-yellow-900">
                              Wstrzymaj
                            </button>
                          )}
                          {campaign.status === 'paused' && (
                            <button className="text-green-600 hover:text-green-900">
                              Wznów
                            </button>
                          )}
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