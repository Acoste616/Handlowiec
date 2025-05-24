import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { assignedTo } = body;
    
    await googleSheetsService.assignLead(params.id, assignedTo);

    return NextResponse.json({
      success: true,
      message: 'Lead assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to assign lead'
    }, { status: 500 });
  }
} 