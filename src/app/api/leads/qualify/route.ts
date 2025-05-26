import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, qualificationData } = body;

    if (!leadId) {
      return NextResponse.json({
        success: false,
        message: 'Lead ID jest wymagany'
      }, { status: 400 });
    }

    if (!qualificationData) {
      return NextResponse.json({
        success: false,
        message: 'Dane kwalifikacyjne są wymagane'
      }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, saving to console');
      console.log('Lead qualification data:', { leadId, qualificationData });
      
      return NextResponse.json({
        success: true,
        message: 'Dane kwalifikacyjne zostały zapisane (console fallback)'
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed'
      }, { status: 500 });
    }

    // Update lead with qualification data
    const { error } = await supabaseAdmin
      .from('leads')
      .update({
        // Informacje biznesowe
        industry: qualificationData.industry,
        company_size: qualificationData.companySize,
        position: qualificationData.position,
        decision_maker: qualificationData.decisionMaker,
        
        // Budżet i timeline
        budget: qualificationData.budget,
        timeline: qualificationData.timeline,
        expected_roi: qualificationData.expectedROI,
        
        // Obecna sytuacja
        current_solution: qualificationData.currentSolution,
        pain_points: qualificationData.painPoints,
        team_size: qualificationData.teamSize,
        current_results: qualificationData.currentResults,
        
        // Oczekiwania
        main_goals: qualificationData.mainGoals,
        priority_areas: qualificationData.priorityAreas,
        success_metrics: qualificationData.successMetrics,
        
        // Dodatkowe
        previous_experience: qualificationData.previousExperience,
        specific_requirements: qualificationData.specificRequirements,
        
        // Status update
        status: 'qualified',
        updated_at: new Date().toISOString(),
        qualified_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) {
      console.error('Error updating lead with qualification data:', error);
      return NextResponse.json({
        success: false,
        message: 'Błąd podczas zapisywania danych kwalifikacyjnych'
      }, { status: 500 });
    }

    console.log(`✅ Lead ${leadId} qualified successfully`);

    return NextResponse.json({
      success: true,
      message: 'Dane kwalifikacyjne zostały zapisane pomyślnie'
    });

  } catch (error) {
    console.error('Lead qualification API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Wystąpił błąd podczas przetwarzania danych'
    }, { status: 500 });
  }
} 