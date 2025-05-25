import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Get client context from middleware
    const clientId = request.headers.get('x-client-id');
    const userId = request.headers.get('x-user-id');

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Parallel queries for better performance
    const [
      leadsCountResult,
      leadsStatusResult,
      leadsPriorityResult,
      recentActivitiesResult,
      conversionRateResult,
      revenueResult,
      teamPerformanceResult,
    ] = await Promise.all([
      // Total leads count
      supabaseAdmin
        .from('leads')
        .select('id', { count: 'exact' })
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString()),

      // Leads by status
      supabaseAdmin
        .from('leads')
        .select('status')
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString()),

      // Leads by priority
      supabaseAdmin
        .from('leads')
        .select('priority')
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString()),

      // Recent activities
      supabaseAdmin
        .from('activities')
        .select(`
          id,
          type,
          description,
          created_at,
          leads!inner(id, first_name, last_name, company, client_id),
          users(full_name)
        `)
        .eq('leads.client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(10),

      // Conversion rate calculation
      supabaseAdmin
        .from('leads')
        .select('status')
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString())
        .in('status', ['closed', 'lost', 'new', 'contacted', 'qualified', 'proposal']),

      // Revenue data
      supabaseAdmin
        .from('leads')
        .select('estimated_value, status, closing_probability')
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString())
        .not('estimated_value', 'is', null),

      // Team performance
      supabaseAdmin
        .from('leads')
        .select(`
          assigned_to,
          status,
          estimated_value,
          users!leads_assigned_to_fkey(full_name)
        `)
        .eq('client_id', clientId)
        .gte('created_at', startDate.toISOString())
        .not('assigned_to', 'is', null),
    ]);

    // Process leads by status
    const statusCounts = leadsStatusResult.data?.reduce((acc: any, lead: any) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Process leads by priority
    const priorityCounts = leadsPriorityResult.data?.reduce((acc: any, lead: any) => {
      acc[lead.priority] = (acc[lead.priority] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate conversion rate
    const conversionData = conversionRateResult.data || [];
    const totalLeads = conversionData.length;
    const closedLeads = conversionData.filter((lead: any) => lead.status === 'closed').length;
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    // Calculate revenue metrics
    const revenueData = revenueResult.data || [];
    const totalPotentialRevenue = revenueData.reduce((sum: number, lead: any) => 
      sum + (lead.estimated_value || 0), 0
    );
    const weightedRevenue = revenueData.reduce((sum: number, lead: any) => 
      sum + ((lead.estimated_value || 0) * (lead.closing_probability || 0) / 100), 0
    );
    const closedRevenue = revenueData
      .filter((lead: any) => lead.status === 'closed')
      .reduce((sum: number, lead: any) => sum + (lead.estimated_value || 0), 0);

    // Process team performance
    const teamData = teamPerformanceResult.data || [];
    const teamPerformance = teamData.reduce((acc: any, lead: any) => {
      const agentName = lead.users?.full_name || 'Unassigned';
      if (!acc[agentName]) {
        acc[agentName] = {
          name: agentName,
          totalLeads: 0,
          closedLeads: 0,
          revenue: 0,
          conversionRate: 0,
        };
      }
      
      acc[agentName].totalLeads += 1;
      if (lead.status === 'closed') {
        acc[agentName].closedLeads += 1;
        acc[agentName].revenue += lead.estimated_value || 0;
      }
      
      return acc;
    }, {});

    // Calculate conversion rates for team members
    Object.values(teamPerformance).forEach((member: any) => {
      member.conversionRate = member.totalLeads > 0 
        ? (member.closedLeads / member.totalLeads) * 100 
        : 0;
    });

    // Prepare response
    const stats = {
      overview: {
        totalLeads: leadsCountResult.count || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
        totalRevenue: closedRevenue,
        potentialRevenue: totalPotentialRevenue,
        weightedRevenue: Math.round(weightedRevenue),
      },
      leadsByStatus: {
        new: statusCounts.new || 0,
        contacted: statusCounts.contacted || 0,
        qualified: statusCounts.qualified || 0,
        proposal: statusCounts.proposal || 0,
        closed: statusCounts.closed || 0,
        lost: statusCounts.lost || 0,
      },
      leadsByPriority: {
        low: priorityCounts.low || 0,
        medium: priorityCounts.medium || 0,
        high: priorityCounts.high || 0,
      },
      recentActivities: recentActivitiesResult.data?.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.created_at,
        leadName: `${activity.leads.first_name} ${activity.leads.last_name}`,
        leadCompany: activity.leads.company,
        agentName: activity.users?.full_name || 'System',
      })) || [],
      teamPerformance: Object.values(teamPerformance).sort((a: any, b: any) => 
        b.conversionRate - a.conversionRate
      ),
      period: parseInt(period),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 