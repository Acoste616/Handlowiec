import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // In development mode, return mock data
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DISABLE_EXTERNAL_SERVICES === 'true';
    
    if (isDevelopment) {
      return NextResponse.json({
        success: true,
        leads: [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            firstName: 'Jan',
            lastName: 'Kowalski',
            company: 'Test Company',
            email: 'jan@test.com',
            phone: '+48 123 456 789',
            message: 'Test lead message',
            source: 'Website',
            status: 'new',
            assignedTo: null,
            notes: '',
            priority: 'medium',
            estimatedValue: 50000,
            lastUpdated: new Date().toISOString(),
            updatedBy: null
          }
        ]
      });
    }

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