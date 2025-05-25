import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { ImportLeadsSchema, CreateLeadSchema } from '@/lib/validations/lead.schema';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Get client context from middleware
    const clientId = request.headers.get('x-client-id');
    const userId = request.headers.get('x-user-id');

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Missing client context' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = ImportLeadsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { leads, skip_duplicates, update_existing } = validationResult.data;

    // Process leads in batches for better performance
    const BATCH_SIZE = 100;
    const results = {
      total: leads.length,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; error: string; data: any }>,
    };

    for (let i = 0; i < leads.length; i += BATCH_SIZE) {
      const batch = leads.slice(i, i + BATCH_SIZE);
      
      for (let j = 0; j < batch.length; j++) {
        const leadData = batch[j];
        const rowNumber = i + j + 1;

        try {
          // Validate individual lead
          const leadValidation = CreateLeadSchema.safeParse(leadData);
          if (!leadValidation.success) {
            results.errors.push({
              row: rowNumber,
              error: `Validation error: ${leadValidation.error.errors.map(e => e.message).join(', ')}`,
              data: leadData,
            });
            continue;
          }

          const validLead = leadValidation.data;

          // Check for existing lead by email
          const { data: existingLead } = await supabaseAdmin
            .from('leads')
            .select('id, email')
            .eq('client_id', clientId)
            .eq('email', validLead.email)
            .single();

          if (existingLead) {
            if (skip_duplicates && !update_existing) {
              results.skipped++;
              continue;
            }

            if (update_existing) {
              // Update existing lead
              const { error: updateError } = await supabaseAdmin
                .from('leads')
                .update({
                  ...validLead,
                  client_id: clientId,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', existingLead.id);

              if (updateError) {
                results.errors.push({
                  row: rowNumber,
                  error: `Update failed: ${updateError.message}`,
                  data: leadData,
                });
              } else {
                results.updated++;
                
                // Create activity for update
                await supabaseAdmin
                  .from('activities')
                  .insert({
                    lead_id: existingLead.id,
                    user_id: userId,
                    type: 'note',
                    description: 'Lead updated via CSV import',
                    metadata: { import_source: 'csv', row_number: rowNumber },
                  });
              }
            } else {
              results.skipped++;
            }
          } else {
            // Create new lead
            const { data: newLead, error: insertError } = await supabaseAdmin
              .from('leads')
              .insert({
                ...validLead,
                client_id: clientId,
              })
              .select('id')
              .single();

            if (insertError) {
              results.errors.push({
                row: rowNumber,
                error: `Insert failed: ${insertError.message}`,
                data: leadData,
              });
            } else {
              results.imported++;
              
              // Create initial activity
              await supabaseAdmin
                .from('activities')
                .insert({
                  lead_id: newLead.id,
                  user_id: userId,
                  type: 'note',
                  description: 'Lead imported via CSV',
                  metadata: { import_source: 'csv', row_number: rowNumber },
                });
            }
          }
        } catch (error) {
          results.errors.push({
            row: rowNumber,
            error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            data: leadData,
          });
        }
      }
    }

    // Create import summary activity
    await supabaseAdmin
      .from('activities')
      .insert({
        lead_id: null, // System activity
        user_id: userId,
        type: 'note',
        description: `CSV import completed: ${results.imported} imported, ${results.updated} updated, ${results.skipped} skipped, ${results.errors.length} errors`,
        metadata: { 
          import_summary: results,
          import_timestamp: new Date().toISOString(),
        },
      });

    return NextResponse.json({
      success: true,
      results,
      message: `Import completed: ${results.imported} leads imported, ${results.updated} updated, ${results.skipped} skipped`,
    });

  } catch (error) {
    console.error('Leads import error:', error);
    return NextResponse.json(
      { error: 'Failed to import leads' },
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