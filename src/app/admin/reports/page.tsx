'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, subDays, subMonths } from 'date-fns';
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
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'rejected';
  assignedTo?: string;
  estimatedValue?: number;
  source: string;
}

interface ReportData {
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  totalRevenue: number;
  avgDealSize: number;
  leadsBySource: { [key: string]: number };
  leadsByStatus: { [key: string]: number };
  leadsByUser: { [key: string]: number };
  dailyLeads: { date: string; count: number }[];
  monthlyTrends: { month: string; leads: number; closed: number; revenue: number }[];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, dateRange]);

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Fetch leads data
      const leadsResponse = await apiClient.get<{ leads: Lead[] }>('/api/admin/leads');
      const allLeads = leadsResponse.leads || [];
      setLeads(allLeads);

      // Filter leads by date range
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case '7d':
          startDate = subDays(now, 7);
          break;
        case '30d':
          startDate = subDays(now, 30);
          break;
        case '90d':
          startDate = subDays(now, 90);
          break;
        case '1y':
          startDate = subDays(now, 365);
          break;
      }

      const filteredLeads = allLeads.filter(lead => 
        new Date(lead.timestamp) >= startDate
      );

      // Generate report data
      const reportData = generateReportData(filteredLeads, startDate, now);
      setReportData(reportData);
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Błąd podczas pobierania danych raportu');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReportData = (leads: Lead[], startDate: Date, endDate: Date): ReportData => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const closedLeads = leads.filter(l => l.status === 'closed').length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    
    const totalRevenue = leads
      .filter(l => l.status === 'closed')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    
    const avgDealSize = closedLeads > 0 ? Math.round(totalRevenue / closedLeads) : 0;

    // Leads by source
    const leadsBySource: { [key: string]: number } = {};
    leads.forEach(lead => {
      leadsBySource[lead.source] = (leadsBySource[lead.source] || 0) + 1;
    });

    // Leads by status
    const leadsByStatus: { [key: string]: number } = {};
    leads.forEach(lead => {
      leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1;
    });

    // Leads by user
    const leadsByUser: { [key: string]: number } = {};
    leads.forEach(lead => {
      const user = lead.assignedTo || 'Nieprzypisane';
      leadsByUser[user] = (leadsByUser[user] || 0) + 1;
    });

    // Daily leads (last 7 days)
    const dailyLeads = eachDayOfInterval({
      start: subDays(endDate, 6),
      end: endDate
    }).map(date => ({
      date: format(date, 'dd.MM'),
      count: leads.filter(lead => 
        format(new Date(lead.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length
    }));

    // Monthly trends (last 6 months)
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(endDate, 5 - i));
      const monthEnd = endOfMonth(monthStart);
      const monthLeads = leads.filter(lead => {
        const leadDate = new Date(lead.timestamp);
        return leadDate >= monthStart && leadDate <= monthEnd;
      });
      
      return {
        month: format(monthStart, 'MMM yyyy', { locale: pl }),
        leads: monthLeads.length,
        closed: monthLeads.filter(l => l.status === 'closed').length,
        revenue: monthLeads
          .filter(l => l.status === 'closed')
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
      };
    });

    return {
      totalLeads,
      newLeads,
      conversionRate,
      totalRevenue,
      avgDealSize,
      leadsBySource,
      leadsByStatus,
      leadsByUser,
      dailyLeads,
      monthlyTrends
    };
  };

  const getStatusText = (status: string) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generowanie raportu...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Brak danych do wyświetlenia</p>
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
              Raporty i Analizy
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="7d">Ostatnie 7 dni</option>
                <option value="30d">Ostatnie 30 dni</option>
                <option value="90d">Ostatnie 90 dni</option>
                <option value="1y">Ostatni rok</option>
              </select>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Łączna liczba leadów</div>
            <div className="text-2xl font-bold text-gray-900">{reportData.totalLeads}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Nowe leady</div>
            <div className="text-2xl font-bold text-yellow-600">{reportData.newLeads}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Wskaźnik konwersji</div>
            <div className="text-2xl font-bold text-green-600">{reportData.conversionRate}%</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Całkowity przychód</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.totalRevenue)}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm font-medium text-gray-500">Średnia wartość deala</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(reportData.avgDealSize)}</div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Leads by Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leady według statusu</h3>
            <div className="space-y-3">
              {Object.entries(reportData.leadsByStatus).map(([status, count]) => {
                const percentage = reportData.totalLeads > 0 ? Math.round((count / reportData.totalLeads) * 100) : 0;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary-600 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leads by Source */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leady według źródła</h3>
            <div className="space-y-3">
              {Object.entries(reportData.leadsBySource).map(([source, count]) => {
                const percentage = reportData.totalLeads > 0 ? Math.round((count / reportData.totalLeads) * 100) : 0;
                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">{source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leads by User */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leady według handlowca</h3>
            <div className="space-y-3">
              {Object.entries(reportData.leadsByUser).map(([user, count]) => {
                const percentage = reportData.totalLeads > 0 ? Math.round((count / reportData.totalLeads) * 100) : 0;
                const displayName = user === 'Nieprzypisane' ? user : user.split('@')[0];
                return (
                  <div key={user} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-medium">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{displayName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Leads Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leady w ostatnich 7 dniach</h3>
            <div className="space-y-2">
              {reportData.dailyLeads.map((day) => {
                const maxCount = Math.max(...reportData.dailyLeads.map(d => d.count));
                const width = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={day.date} className="flex items-center">
                    <div className="w-12 text-xs text-gray-600">{day.date}</div>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${width}%` }}
                        >
                          {day.count > 0 && (
                            <span className="text-white text-xs font-medium">{day.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trendy miesięczne</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miesiąc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nowe leady
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zamknięte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konwersja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Przychód
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.monthlyTrends.map((month) => {
                  const conversionRate = month.leads > 0 ? Math.round((month.closed / month.leads) * 100) : 0;
                  return (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.leads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.closed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(month.revenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eksport danych</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                const csvData = leads.map(lead => ({
                  'Data': format(new Date(lead.timestamp), 'dd.MM.yyyy HH:mm'),
                  'Imię': lead.firstName,
                  'Firma': lead.company,
                  'Email': lead.email,
                  'Telefon': lead.phone,
                  'Status': getStatusText(lead.status),
                  'Źródło': lead.source,
                  'Przypisany do': lead.assignedTo || 'Nieprzypisane',
                  'Wartość': lead.estimatedValue || ''
                }));
                
                const csv = [
                  Object.keys(csvData[0] || {}).join(','),
                  ...csvData.map(row => Object.values(row).join(','))
                ].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `leads-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                a.click();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              📊 Eksportuj do CSV
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              🖨️ Drukuj raport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 