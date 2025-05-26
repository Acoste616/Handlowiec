import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const clientId = request.headers.get('X-Client-ID');
    const { leadId } = params;
    const { priority } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID required' },
        { status: 400 }
      );
    }

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID required' },
        { status: 400 }
      );
    }

    if (!priority || !['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Valid priority required (low, medium, high)' },
        { status: 400 }
      );
    }

    // For now, simulate successful update
    // In production, this would update the lead in Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          // Example of real data update (commented out for now)
          /*
          const { data, error } = await supabase
            .from('leads')
            .update({ 
              priority,
              updated_at: new Date().toISOString()
            })
            .eq('id', leadId)
            .eq('client_id', clientId)
            .select()
            .single();

          if (error) {
            throw error;
          }

          return NextResponse.json({
            success: true,
            data: { lead: data },
            message: 'Priorytet leada został zaktualizowany'
          });
          */
        } catch (error) {
          console.error('Error updating lead priority:', error);
        }
      }
    }

    // Mock successful response
    return NextResponse.json({
      success: true,
      data: {
        leadId,
        priority,
        updatedAt: new Date().toISOString()
      },
      message: 'Priorytet leada został zaktualizowany'
    });

  } catch (error) {
    console.error('Update lead priority error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 