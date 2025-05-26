import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import { subDays, format } from 'date-fns';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalValue: number;
  conversionRate: number;
  avgDealSize: number;
  pendingOffers: number;
  weeklyProgress: {
    date: string;
    leads: number;
    qualified: number;
    offers: number;
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    agentName: string;
    timestamp: string;
  }[];
  salesFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const clientId = request.headers.get('X-Client-ID');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID required' },
        { status: 400 }
      );
    }

    // For now, return mock data. In production, this would query Supabase
    const mockStats: DashboardStats = {
      totalLeads: 156,
      activeLeads: 89,
      qualifiedLeads: 47,
      closedDeals: 12,
      totalValue: 485000,
      conversionRate: 7.7,
      avgDealSize: 40416,
      pendingOffers: 3,
      weeklyProgress: [
        { date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), leads: 8, qualified: 3, offers: 1 },
        { date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), leads: 12, qualified: 5, offers: 2 },
        { date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), leads: 6, qualified: 2, offers: 0 },
        { date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), leads: 15, qualified: 7, offers: 3 },
        { date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), leads: 9, qualified: 4, offers: 1 },
        { date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), leads: 11, qualified: 6, offers: 2 },
        { date: format(new Date(), 'yyyy-MM-dd'), leads: 7, qualified: 2, offers: 1 },
      ],
      recentActivities: [
        {
          id: '1',
          type: 'offer',
          description: 'Nowa oferta gotowa do akceptacji',
          agentName: 'Bartek Nowak',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'call',
          description: 'Rozmowa z klientem zakończona sukcesem',
          agentName: 'Marta Kowalska',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'meeting',
          description: 'Spotkanie prezentacyjne zaplanowane',
          agentName: 'Tomasz Wiśniewski',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          type: 'email',
          description: 'Wysłano materiały informacyjne',
          agentName: 'Bartek Nowak',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
      salesFunnel: [
        { stage: 'Nowe leady', count: 45, percentage: 100 },
        { stage: 'Kontakt', count: 32, percentage: 71 },
        { stage: 'Qualified', count: 18, percentage: 40 },
        { stage: 'Propozycja', count: 8, percentage: 18 },
        { stage: 'Zamknięte', count: 3, percentage: 7 },
      ],
    };

    // If Supabase is configured, you could fetch real data here
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          // Example of real data fetching (commented out for now)
          /*
          const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('client_id', clientId);

          if (!error && leads) {
            // Process real data here
            mockStats.totalLeads = leads.length;
            mockStats.newLeads = leads.filter(lead => 
              new Date(lead.created_at) > subDays(new Date(), 7)
            ).length;
            // ... more real data processing
          }
          */
        } catch (error) {
          console.error('Error fetching real data:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 