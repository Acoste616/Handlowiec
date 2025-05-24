import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // In development mode, return mock stats
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DISABLE_EXTERNAL_SERVICES === 'true';
    
    if (isDevelopment) {
      return NextResponse.json({
        totalLeads: 156,
        newLeads: 12,
        qualifiedLeads: 45,
        closedDeals: 8,
        pipeline: 750000,
        conversionRate: 18.5
      });
    }

    const stats = await googleSheetsService.getDetailedStats();
    
    return NextResponse.json({
      totalLeads: stats.totalLeads,
      newLeads: stats.newLeads,
      qualifiedLeads: stats.qualifiedLeads,
      closedDeals: stats.closedDeals,
      pipeline: stats.estimatedPipeline,
      conversionRate: stats.conversionRate
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      closedDeals: 0,
      pipeline: 0,
      conversionRate: 0
    });
  }
} 