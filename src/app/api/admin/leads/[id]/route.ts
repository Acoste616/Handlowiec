import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, assignedTo, priority, estimatedValue, updatedBy } = body;
    
    // Aktualizuj lead w Google Sheets
    await googleSheetsService.updateLead(params.id, {
      status,
      notes,
      assignedTo,
      priority,
      estimatedValue,
      lastUpdated: new Date().toISOString(),
      updatedBy
    });

    // Wyślij powiadomienie na Slack jeśli status się zmienił
    if (status) {
      await notifyStatusChange(params.id, status, updatedBy);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update lead'
    }, { status: 500 });
  }
}

// Helper function
async function notifyStatusChange(leadId: string, newStatus: string, updatedBy: string) {
  try {
    const lead = await googleSheetsService.getLeadById(leadId);
    if (!lead) return;

    const message = {
      text: `🔄 Status leada zmieniony`,
      attachments: [
        {
          color: getStatusColor(newStatus),
          fields: [
            {
              title: 'Lead',
              value: `${lead.firstName} (${lead.company})`,
              short: true
            },
            {
              title: 'Nowy status',
              value: newStatus,
              short: true
            },
            {
              title: 'Zmienił',
              value: updatedBy,
              short: true
            },
            {
              title: 'Data',
              value: new Date().toLocaleString('pl-PL'),
              short: true
            }
          ]
        }
      ]
    };

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'new': return '#fbbf24';
    case 'contacted': return '#3b82f6';
    case 'qualified': return '#10b981';
    case 'proposal': return '#8b5cf6';
    case 'closed': return '#059669';
    case 'rejected': return '#ef4444';
    default: return '#6b7280';
  }
} 