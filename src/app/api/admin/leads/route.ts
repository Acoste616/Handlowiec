import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

export async function GET(request: NextRequest) {
  try {
    // W rzeczywistości dodałbyś tutaj auth middleware
    const authHeader = request.headers.get('authorization');
    // Tymczasowo wyłączamy auth dla developmentu
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Pobierz leady z Google Sheets
    const leads = await googleSheetsService.getAllLeads();
    
    return NextResponse.json({
      success: true,
      leads: leads.map(lead => ({
        id: lead.id,
        timestamp: lead.timestamp,
        firstName: lead.firstName,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        status: lead.status || 'new',
        assignedTo: lead.assignedTo,
        notes: lead.notes || '',
        priority: lead.priority || 'medium',
        estimatedValue: lead.estimatedValue || null,
        lastUpdated: lead.lastUpdated,
        updatedBy: lead.updatedBy
      }))
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leads'
    }, { status: 500 });
  }
} 