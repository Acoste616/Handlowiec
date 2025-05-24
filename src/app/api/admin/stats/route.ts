import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

export async function GET() {
  try {
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