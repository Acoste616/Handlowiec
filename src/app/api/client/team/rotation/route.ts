import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
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

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, returning mock data for build');
      return NextResponse.json({
        rotations: [],
        currentRotation: null,
        nextRotation: null
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        rotations: [],
        currentRotation: null,
        nextRotation: null
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

    // Get current and upcoming rotations
    const { data: rotations, error } = await supabaseAdmin
      .from('team_rotations')
      .select(`
        id,
        rotation_type,
        start_date,
        end_date,
        is_active,
        created_at,
        users!team_rotations_user_id_fkey(id, full_name, email)
      `)
      .eq('client_id', clientId)
      .order('start_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching rotations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch team rotations' },
        { status: 500 }
      );
    }

    const now = new Date();
    const currentRotation = rotations?.find((rotation: any) => 
      new Date(rotation.start_date) <= now && 
      new Date(rotation.end_date) >= now &&
      rotation.is_active
    );

    const nextRotation = rotations?.find((rotation: any) => 
      new Date(rotation.start_date) > now &&
      rotation.is_active
    );

    return NextResponse.json({
      rotations: rotations || [],
      currentRotation,
      nextRotation
    });

  } catch (error) {
    console.error('Team rotation GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team rotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, returning mock response for build');
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable'
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable'
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

    const body = await request.json();
    const { rotation_type, user_ids } = body;

    if (!rotation_type || !user_ids || !Array.isArray(user_ids)) {
      return NextResponse.json(
        { error: 'rotation_type and user_ids array are required' },
        { status: 400 }
      );
    }

    if (!['30_days', '90_days'].includes(rotation_type)) {
      return NextResponse.json(
        { error: 'rotation_type must be either "30_days" or "90_days"' },
        { status: 400 }
      );
    }

    // Calculate rotation dates
    const startDate = new Date();
    const endDate = new Date();
    const days = rotation_type === '30_days' ? 30 : 90;
    endDate.setDate(startDate.getDate() + days);

    // Deactivate current rotations
    await supabaseAdmin
      .from('team_rotations')
      .update({ is_active: false })
      .eq('client_id', clientId)
      .eq('is_active', true);

    // Create new rotations for each user
    const rotationsToInsert = user_ids.map(userId => ({
      client_id: clientId,
      user_id: userId,
      rotation_type,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
    }));

    const { data: newRotations, error } = await supabaseAdmin
      .from('team_rotations')
      .insert(rotationsToInsert)
      .select(`
        id,
        rotation_type,
        start_date,
        end_date,
        is_active,
        users!team_rotations_user_id_fkey(id, full_name, email)
      `);

    if (error) {
      console.error('Error creating rotations:', error);
      return NextResponse.json(
        { error: 'Failed to create team rotations' },
        { status: 500 }
      );
    }

    // Log activity
    try {
      await supabaseAdmin
        .from('activities')
        .insert({
          lead_id: null,
          user_id: null,
          type: 'team_rotation',
          description: `New ${rotation_type.replace('_', ' ')} team rotation created for ${user_ids.length} users`,
          metadata: {
            rotation_type,
            user_count: user_ids.length,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            client_id: clientId
          },
          created_at: new Date().toISOString(),
        });
    } catch (activityError) {
      console.error('Failed to log rotation activity:', activityError);
    }

    return NextResponse.json({
      success: true,
      message: `Team rotation created successfully`,
      rotations: newRotations,
      rotation_type,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

  } catch (error) {
    console.error('Team rotation POST error:', error);
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
    const { data: existingRotation } = await getSupabaseAdmin()
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
    const { data: updatedRotation, error } = await getSupabaseAdmin()
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
    await getSupabaseAdmin()
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
    const { data: agents } = await getSupabaseAdmin()
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
    const { data: activeRotations } = await getSupabaseAdmin()
      .from('team_rotations')
      .select('user_id, end_date')
      .eq('client_id', clientId)
      .eq('rotation_type', rotationType)
      .eq('is_active', true);

    const rotationDays = rotationType === '30_days' ? 30 : 90;
    const now = new Date();
    
    // Calculate optimal schedule
    const schedule = agents.map((agent: any, index: number) => {
      // Check if agent has active rotation
      const activeRotation = activeRotations?.find((r: any) => r.user_id === agent.id);
      
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