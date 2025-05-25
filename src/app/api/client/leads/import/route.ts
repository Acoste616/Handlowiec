import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import { ImportLeadsSchema, CreateLeadSchema } from '@/lib/validations/lead.schema';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Polish CSV headers mapping
const POLISH_HEADERS_MAP: Record<string, string> = {
  'imię': 'first_name',
  'imie': 'first_name',
  'nazwisko': 'last_name',
  'firma': 'company',
  'przedsiębiorstwo': 'company',
  'email': 'email',
  'e-mail': 'email',
  'telefon': 'phone',
  'tel': 'phone',
  'status': 'status',
  'priorytet': 'priority',
  'wartość': 'estimated_value',
  'wartosc': 'estimated_value',
  'prawdopodobieństwo': 'closing_probability',
  'prawdopodobienstwo': 'closing_probability',
  'źródło': 'source',
  'zrodlo': 'source',
  'notatki': 'notes',
  'uwagi': 'notes',
};

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const mappedHeaders = headers.map(header => POLISH_HEADERS_MAP[header] || header);

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    mappedHeaders.forEach((header, index) => {
      if (values[index]) {
        row[header] = values[index];
      }
    });

    // Validate required fields
    if (row.first_name && row.last_name && row.email && row.company) {
      data.push(row);
    }
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, returning mock response for build');
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable',
        imported: 0,
        errors: []
      });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Service temporarily unavailable',
        imported: 0,
        errors: []
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const leads = parseCSV(csvText);

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No valid leads found in CSV file' },
        { status: 400 }
      );
    }

    // Limit to 1000 leads per import
    if (leads.length > 1000) {
      return NextResponse.json(
        { error: 'Too many leads. Maximum 1000 leads per import' },
        { status: 400 }
      );
    }

    // Prepare leads for insertion
    const leadsToInsert = leads.map(lead => ({
      client_id: clientId,
      first_name: lead.first_name,
      last_name: lead.last_name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone || null,
      status: lead.status || 'new',
      priority: lead.priority || 'medium',
      estimated_value: lead.estimated_value ? parseFloat(lead.estimated_value) : null,
      closing_probability: lead.closing_probability ? parseInt(lead.closing_probability) : 50,
      source: lead.source || 'csv_import',
      notes: lead.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert leads in batches
    const batchSize = 100;
    const errors: string[] = [];
    let imported = 0;

    for (let i = 0; i < leadsToInsert.length; i += batchSize) {
      const batch = leadsToInsert.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabaseAdmin
          .from('leads')
          .insert(batch)
          .select('id');

        if (error) {
          console.error('Batch insert error:', error);
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          imported += data?.length || 0;
        }
      } catch (batchError) {
        console.error('Batch processing error:', batchError);
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: Processing failed`);
      }
    }

    // Log import activity
    try {
      await supabaseAdmin
        .from('activities')
        .insert({
          lead_id: null, // System activity
          user_id: null,
          type: 'csv_import',
          description: `Imported ${imported} leads from CSV file: ${file.name}`,
          metadata: {
            filename: file.name,
            total_leads: leads.length,
            imported_leads: imported,
            errors_count: errors.length,
            client_id: clientId
          },
          created_at: new Date().toISOString(),
        });
    } catch (activityError) {
      console.error('Failed to log import activity:', activityError);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${imported} leads`,
      imported,
      total: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Failed to import CSV file' },
      { status: 500 }
    );
  }
}

// CSV parsing endpoint
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      return NextResponse.json(
        { error: 'Invalid file type. Only CSV files are allowed' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain at least a header and one data row' },
        { status: 400 }
      );
    }

    // Parse CSV
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const leads = [];

    // Expected headers mapping
    const headerMapping: Record<string, string> = {
      'first_name': 'first_name',
      'firstname': 'first_name',
      'imię': 'first_name',
      'last_name': 'last_name',
      'lastname': 'last_name',
      'nazwisko': 'last_name',
      'company': 'company',
      'firma': 'company',
      'email': 'email',
      'phone': 'phone',
      'telefon': 'phone',
      'status': 'status',
      'priority': 'priority',
      'priorytet': 'priority',
      'estimated_value': 'estimated_value',
      'wartość': 'estimated_value',
      'source': 'source',
      'źródło': 'source',
      'notes': 'notes',
      'notatki': 'notes',
    };

    // Map headers to our schema
    const mappedHeaders = headers.map(header => 
      headerMapping[header.toLowerCase()] || header.toLowerCase()
    );

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length !== headers.length) {
        continue; // Skip malformed rows
      }

      const leadData: any = {};
      
      mappedHeaders.forEach((header, index) => {
        const value = values[index];
        if (value && value !== '') {
          if (header === 'estimated_value') {
            leadData[header] = parseFloat(value.replace(/[^\d.-]/g, '')) || undefined;
          } else if (header === 'closing_probability') {
            leadData[header] = parseInt(value) || 0;
          } else {
            leadData[header] = value;
          }
        }
      });

      // Set defaults for required fields if missing
      if (!leadData.status) leadData.status = 'new';
      if (!leadData.priority) leadData.priority = 'medium';
      if (!leadData.closing_probability) leadData.closing_probability = 0;

      leads.push(leadData);
    }

    return NextResponse.json({
      success: true,
      preview: leads.slice(0, 5), // First 5 rows for preview
      total: leads.length,
      headers: mappedHeaders,
      leads: leads, // Full data for import
    });

  } catch (error) {
    console.error('CSV parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse CSV file' },
      { status: 500 }
    );
  }
} 