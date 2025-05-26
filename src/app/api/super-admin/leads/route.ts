import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, returning mock data');
      return NextResponse.json({
        success: false,
        message: 'Database not configured',
        data: []
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        data: []
      });
    }

    // Get all leads from Supabase
    const { data: leads, error } = await supabaseAdmin
      .from('leads')
      .select(`
        id,
        first_name,
        last_name,
        company,
        email,
        phone,
        status,
        priority,
        source,
        notes,
        estimated_value,
        created_at,
        updated_at,
        industry,
        company_size,
        position,
        decision_maker,
        budget,
        timeline,
        expected_roi,
        current_solution,
        pain_points,
        team_size,
        current_results,
        main_goals,
        priority_areas,
        success_metrics,
        previous_experience,
        specific_requirements,
        qualified_at,
        clients!inner(name, domain)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch leads',
        data: []
      });
    }

    // Transform data to match frontend interface
    const transformedLeads = leads?.map((lead: any) => ({
      id: lead.id,
      type: 'company' as const, // Default to company for now
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email,
      phone: lead.phone || '',
      companyName: lead.company,
      budget: lead.budget || '15000-30000', // Use qualification data or default
      timeline: lead.timeline || '3-months', // Use qualification data or default
      painPoints: lead.pain_points || ['Brak systemu CRM'], // Use qualification data or default
      message: lead.notes || '',
      createdAt: lead.created_at,
      status: lead.status as 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost',
      assignedAgent: undefined,
      score: 75, // Default score
      priority: lead.priority as 'low' | 'medium' | 'high',
      
      // Qualification data
      industry: lead.industry,
      companySize: lead.company_size,
      position: lead.position,
      decisionMaker: lead.decision_maker,
      expectedROI: lead.expected_roi,
      currentSolution: lead.current_solution,
      teamSize: lead.team_size,
      currentResults: lead.current_results,
      mainGoals: lead.main_goals,
      priorityAreas: lead.priority_areas,
      successMetrics: lead.success_metrics,
      previousExperience: lead.previous_experience,
      specificRequirements: lead.specific_requirements,
      qualifiedAt: lead.qualified_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedLeads,
      total: transformedLeads.length
    });

  } catch (error) {
    console.error('Super admin leads API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      data: []
    }, { status: 500 });
  }
} 