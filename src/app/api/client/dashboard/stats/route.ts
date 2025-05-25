import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, returning mock data for build');
      return NextResponse.json({
        totalLeads: 0,
        activeLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        recentActivities: [],
        teamPerformance: [],
        monthlyStats: []
      });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Get total leads count
    const { count: totalLeads } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    // Get active leads count
    const { count: activeLeads } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .in('status', ['new', 'contacted', 'qualified', 'proposal']);

    // Get converted leads count
    const { count: convertedLeads } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'converted');

    // Calculate conversion rate
    const conversionRate = totalLeads && totalLeads > 0 
      ? Math.round((convertedLeads || 0) / totalLeads * 100) 
      : 0;

    // Get recent activities
    const { data: recentActivities } = await supabaseAdmin
      .from('activities')
      .select(`
        id,
        type,
        description,
        created_at,
        leads!inner(client_id, first_name, last_name, company)
      `)
      .eq('leads.client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get team performance
    const { data: teamPerformance } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        full_name,
        leads!leads_assigned_to_fkey(id, status)
      `)
      .eq('client_id', clientId)
      .eq('role', 'sales_rep');

    // Process team performance data
    const processedTeamPerformance = teamPerformance?.map(user => {
      const userLeads = user.leads || [];
      const totalAssigned = userLeads.length;
      const converted = userLeads.filter((lead: any) => lead.status === 'converted').length;
      const conversionRate = totalAssigned > 0 ? Math.round((converted / totalAssigned) * 100) : 0;

      return {
        id: user.id,
        name: user.full_name || 'Unknown',
        totalLeads: totalAssigned,
        convertedLeads: converted,
        conversionRate
      };
    }) || [];

    // Get monthly stats (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: monthlyLeads } = await supabaseAdmin
      .from('leads')
      .select('created_at, status')
      .eq('client_id', clientId)
      .gte('created_at', sixMonthsAgo.toISOString());

    // Process monthly stats
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthLeads = monthlyLeads?.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= monthStart && leadDate <= monthEnd;
      }) || [];

      const totalMonth = monthLeads.length;
      const convertedMonth = monthLeads.filter(lead => lead.status === 'converted').length;

      monthlyStats.push({
        month: date.toLocaleDateString('pl-PL', { month: 'short', year: 'numeric' }),
        totalLeads: totalMonth,
        convertedLeads: convertedMonth,
        conversionRate: totalMonth > 0 ? Math.round((convertedMonth / totalMonth) * 100) : 0
      });
    }

    return NextResponse.json({
      totalLeads: totalLeads || 0,
      activeLeads: activeLeads || 0,
      convertedLeads: convertedLeads || 0,
      conversionRate,
      recentActivities: recentActivities || [],
      teamPerformance: processedTeamPerformance,
      monthlyStats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 