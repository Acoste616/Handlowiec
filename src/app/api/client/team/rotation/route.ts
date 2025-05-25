import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { z } from 'zod';

const CreateRotationSchema = z.object({
  user_id: z.string().uuid(),
  rotation_type: z.enum(['30_days', '90_days']),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const UpdateRotationSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean().optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const clientId = request.headers.get('x-client-id');
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // '30_days' or '90_days'
    const active = searchParams.get('active'); // 'true' or 'false'
    const userId = searchParams.get('user_id');

    let query = supabaseAdmin
      .from('team_rotations')
      .select(`
        id,
        user_id,
        rotation_type,
        start_date,
        end_date,
        is_active,
        created_at,
        users!team_rotations_user_id_fkey(
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('rotation_type', type);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: rotations, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate rotation statistics
    const stats = {
      total: rotations?.length || 0,
      active: rotations?.filter(r => r.is_active).length || 0,
      by_type: {
        '30_days': rotations?.filter(r => r.rotation_type === '30_days').length || 0,
        '90_days': rotations?.filter(r => r.rotation_type === '90_days').length || 0,
      },
      upcoming_endings: rotations?.filter(r => {
        if (!r.is_active) return false;
        const endDate = new Date(r.end_date);
        const now = new Date();
        const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilEnd <= 7 && daysUntilEnd >= 0;
      }).length || 0,
    };

    // Calculate performance metrics for active rotations
    const activeRotations = rotations?.filter(r => r.is_active) || [];
    const performanceData = await Promise.all(
      activeRotations.map(async (rotation) => {
        const { data: leads } = await supabaseAdmin
          .from('leads')
          .select('id, status, estimated_value, created_at')
          .eq('client_id', clientId)
          .eq('assigned_to', rotation.user_id)
          .gte('created_at', rotation.start_date)
          .lte('created_at', rotation.end_date);

        const totalLeads = leads?.length || 0;
        const closedLeads = leads?.filter(l => l.status === 'closed').length || 0;
        const revenue = leads?.filter(l => l.status === 'closed')
          .reduce((sum, l) => sum + (l.estimated_value || 0), 0) || 0;

        return {
          ...rotation,
          performance: {
            totalLeads,
            closedLeads,
            conversionRate: totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0,
            revenue,
          },
        };
      })
    );

    return NextResponse.json({
      rotations: performanceData,
      stats,
    });

  } catch (error) {
    console.error('Team rotation fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team rotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const clientId = request.headers.get('x-client-id');
    const userId = request.headers.get('x-user-id');
    
    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = CreateRotationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const rotationData = validationResult.data;

    // Validate dates
    const startDate = new Date(rotationData.start_date);
    const endDate = new Date(rotationData.end_date);
    
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check if user belongs to the client
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, client_id')
      .eq('id', rotationData.user_id)
      .eq('client_id', clientId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or does not belong to this client' },
        { status: 404 }
      );
    }

    // Check for overlapping rotations
    const { data: overlapping } = await supabaseAdmin
      .from('team_rotations')
      .select('id')
      .eq('client_id', clientId)
      .eq('user_id', rotationData.user_id)
      .eq('rotation_type', rotationData.rotation_type)
      .eq('is_active', true)
      .or(`start_date.lte.${rotationData.end_date},end_date.gte.${rotationData.start_date}`);

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json(
        { error: 'User already has an active rotation of this type in the specified period' },
        { status: 409 }
      );
    }

    // Create rotation
    const { data: newRotation, error } = await supabaseAdmin
      .from('team_rotations')
      .insert({
        ...rotationData,
        client_id: clientId,
        is_active: true,
      })
      .select(`
        id,
        user_id,
        rotation_type,
        start_date,
        end_date,
        is_active,
        created_at,
        users!team_rotations_user_id_fkey(
          id,
          full_name,
          email,
          role
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Create activity log
    await supabaseAdmin
      .from('activities')
      .insert({
        lead_id: null,
        user_id: userId,
        type: 'note',
        description: `Created ${rotationData.rotation_type.replace('_', '-')} rotation for ${(newRotation.users as any)?.full_name || 'User'}`,
        metadata: {
          rotation_id: newRotation.id,
          rotation_type: rotationData.rotation_type,
          start_date: rotationData.start_date,
          end_date: rotationData.end_date,
        },
      });

    return NextResponse.json({
      success: true,
      rotation: newRotation,
    });

  } catch (error) {
    console.error('Team rotation creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create team rotation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const clientId = request.headers.get('x-client-id');
    const userId = request.headers.get('x-user-id');
    
    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateRotationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validationResult.data;

    // Verify rotation belongs to client
    const { data: existingRotation } = await supabaseAdmin
      .from('team_rotations')
      .select('id, client_id, user_id, rotation_type')
      .eq('id', id)
      .eq('client_id', clientId)
      .single();

    if (!existingRotation) {
      return NextResponse.json(
        { error: 'Rotation not found' },
        { status: 404 }
      );
    }

    // Update rotation
    const { data: updatedRotation, error } = await supabaseAdmin
      .from('team_rotations')
      .update(updateData)
      .eq('id', id)
      .select(`
        id,
        user_id,
        rotation_type,
        start_date,
        end_date,
        is_active,
        created_at,
        users!team_rotations_user_id_fkey(
          id,
          full_name,
          email,
          role
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Create activity log
    await supabaseAdmin
      .from('activities')
      .insert({
        lead_id: null,
        user_id: userId,
        type: 'note',
        description: `Updated ${existingRotation.rotation_type.replace('_', '-')} rotation for ${(updatedRotation.users as any)?.full_name || 'User'}`,
        metadata: {
          rotation_id: id,
          changes: updateData,
        },
      });

    return NextResponse.json({
      success: true,
      rotation: updatedRotation,
    });

  } catch (error) {
    console.error('Team rotation update error:', error);
    return NextResponse.json(
      { error: 'Failed to update team rotation' },
      { status: 500 }
    );
  }
}

// Calculate optimal rotation schedule
export async function PUT(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const clientId = request.headers.get('x-client-id');
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rotationType = searchParams.get('type') as '30_days' | '90_days';
    
    if (!rotationType || !['30_days', '90_days'].includes(rotationType)) {
      return NextResponse.json(
        { error: 'Invalid rotation type' },
        { status: 400 }
      );
    }

    // Get all agents for this client
    const { data: agents } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email')
      .eq('client_id', clientId)
      .eq('role', 'agent');

    if (!agents || agents.length === 0) {
      return NextResponse.json(
        { error: 'No agents found for this client' },
        { status: 404 }
      );
    }

    // Get current active rotations
    const { data: activeRotations } = await supabaseAdmin
      .from('team_rotations')
      .select('user_id, end_date')
      .eq('client_id', clientId)
      .eq('rotation_type', rotationType)
      .eq('is_active', true);

    const rotationDays = rotationType === '30_days' ? 30 : 90;
    const now = new Date();
    
    // Calculate optimal schedule
    const schedule = agents.map((agent, index) => {
      // Check if agent has active rotation
      const activeRotation = activeRotations?.find(r => r.user_id === agent.id);
      
      let startDate: Date;
      
      if (activeRotation) {
        // Start after current rotation ends
        startDate = new Date(activeRotation.end_date);
        startDate.setDate(startDate.getDate() + 1);
      } else {
        // Stagger start dates to avoid all rotations ending at once
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() + (index * 7)); // 1 week apart
      }
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + rotationDays);
      
      return {
        user_id: agent.id,
        user_name: agent.full_name,
        user_email: agent.email,
        rotation_type: rotationType,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        days_until_start: Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      };
    });

    return NextResponse.json({
      success: true,
      schedule,
      rotation_type: rotationType,
      total_agents: agents.length,
    });

  } catch (error) {
    console.error('Rotation schedule calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate rotation schedule' },
      { status: 500 }
    );
  }
} 