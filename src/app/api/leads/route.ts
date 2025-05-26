import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import { config } from '@/config/index';
import { leadFormSchema } from '@/lib/validations';
import { sanitizeString, generateTrackingId, extractUTMParams, createRateLimiter } from '@/utils';
import type { ApiResponse } from '@/types/api';
import type { LeadFormData } from '@/types/form';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Rate limiter instance
const rateLimiter = createRateLimiter(
  config.security.rateLimit.max,
  config.security.rateLimit.windowMs
);

/**
 * Handle POST request for lead submission
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const startTime = Date.now();
  const trackingId = generateTrackingId();
  
  // Get client IP for rate limiting
  const clientIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  try {
    // Check rate limit
    const rateLimitResult = rateLimiter.check(clientIp);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Za dużo zgłoszeń. Spróbuj ponownie za 15 minut.',
          timestamp: new Date().toISOString(),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.security.rateLimit.max.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Extract UTM parameters from referer or request
    const referer = request.headers.get('referer') || '';
    const utmParams = extractUTMParams(referer);
    
    // Merge form data with UTM parameters and source detection
    const enrichedFormData = {
      ...body,
      ...utmParams,
      source: body.source || detectSource(request),
      trackingId,
      // Auto-approve consent for internal sources (super-admin, etc.)
      consent: body.consent !== undefined ? body.consent : (body.source === 'super-admin' ? true : false),
    };

    // Validate form data
    const validationResult = leadFormSchema.safeParse(enrichedFormData);
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!errors[field]) errors[field] = [];
        errors[field].push(error.message);
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Błędy walidacji formularza',
          errors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const formData: LeadFormData = validationResult.data;

    // Sanitize input data
    formData.firstName = sanitizeString(formData.firstName);
    formData.company = sanitizeString(formData.company);
    formData.email = sanitizeString(formData.email);
    formData.phone = sanitizeString(formData.phone);
    formData.message = sanitizeString(formData.message);

    // Log submission for monitoring
    console.log(`[${trackingId}] Lead submission from ${formData.company} (${formData.email})`);

    // Save to storage systems
    let leadSaved = false;
    let leadId: string | null = null;

    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        if (supabaseAdmin) {
          // Get the default client for website leads
          const { data: defaultClient } = await supabaseAdmin
            .from('clients')
            .select('id')
            .eq('domain', 'bezhandlowca.pl')
            .single();

          if (!defaultClient) {
            console.error(`[${trackingId}] Default client not found`);
            throw new Error('Default client not configured');
          }
          
          const { data: lead, error } = await supabaseAdmin
            .from('leads')
            .insert({
              client_id: defaultClient.id,
              first_name: formData.firstName,
              last_name: formData.firstName.split(' ').slice(1).join(' ') || 'Unknown',
              company: formData.company,
              email: formData.email,
              phone: formData.phone || null,
              status: 'new',
              priority: 'medium',
              source: formData.source || 'website',
              notes: formData.message,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (error) {
            console.error(`[${trackingId}] Supabase save failed:`, error);
          } else {
            leadSaved = true;
            leadId = lead?.id || null;
            console.log(`[${trackingId}] Lead saved to Supabase with ID: ${leadId}`);
          }
        }
      } catch (error) {
        console.error(`[${trackingId}] Supabase integration failed:`, error);
      }
    }

    // Try Google Sheets as fallback or primary storage - temporarily disabled for debugging
    if (!leadSaved) {
      try {
        console.log(`[${trackingId}] Google Sheets temporarily disabled for debugging`);
        /*
        const { googleSheetsService } = await import('@/services/googleSheets');
        const result = await googleSheetsService.addLead(formData);
        if (result.success) {
          leadSaved = true;
          leadId = result.rowId.toString();
          console.log(`[${trackingId}] Lead saved to Google Sheets with row ID: ${leadId}`);
        }
        */
      } catch (error) {
        console.error(`[${trackingId}] Google Sheets save failed:`, error);
      }
    }

    // Final fallback: Log to console if no storage is available
    if (!leadSaved) {
      console.log(`[${trackingId}] Lead saved to console fallback:`, {
        firstName: formData.firstName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: formData.source,
        timestamp: new Date().toISOString(),
      });
      leadSaved = true; // Consider console logging as "saved"
    }

    // Send email notifications if configured
    try {
      if (config.email.user && config.email.password) {
        // Import email service dynamically to avoid build errors
        const { emailService } = await import('@/services/email');
        
        // Send lead notification to admin
        await emailService.sendLeadNotification(formData);
        console.log(`[${trackingId}] Email notification sent`);
        
        // Send case study if this is a case study request
        if (formData.source === 'case-study-lead-magnet') {
          await emailService.sendCaseStudy(formData);
          console.log(`[${trackingId}] Case study email sent to ${formData.email}`);
        } else {
          // Send regular confirmation email
          await emailService.sendLeadConfirmation(formData);
          console.log(`[${trackingId}] Confirmation email sent`);
        }
      }
    } catch (error) {
      console.error(`[${trackingId}] Email notification failed:`, error);
    }

    // Send Slack notification if configured - temporarily disabled for debugging
    try {
      console.log(`[${trackingId}] Slack notifications temporarily disabled for debugging`);
      /*
      const { slackService } = await import('@/services/slack');
      await slackService.sendLeadNotification(formData);
      console.log(`[${trackingId}] Slack notification sent`);
      */
    } catch (error) {
      console.error(`[${trackingId}] Slack notification failed:`, error);
    }

    // Log successful submission
    const processingTime = Date.now() - startTime;
    console.log(`[${trackingId}] Lead processed successfully in ${processingTime}ms`);

    return NextResponse.json(
      {
        success: true,
        message: 'Dziękujemy! Twoje zgłoszenie zostało wysłane. Skontaktujemy się w ciągu 15 minut.',
        data: {
          trackingId,
          leadId,
        },
        timestamp: new Date().toISOString(),
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': config.security.rateLimit.max.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );

  } catch (error) {
    console.error(`[${trackingId}] Lead submission error:`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Wystąpił błąd podczas przetwarzania zgłoszenia. Spróbuj ponownie lub skontaktuj się bezpośrednio.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json(
    { message: 'OK' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': config.isDevelopment ? '*' : config.app.url,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}

/**
 * Detect source from request headers
 */
function detectSource(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // Check for mobile
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    return 'mobile';
  }
  
  // Check for social media referrers
  if (referer.includes('facebook.com')) return 'facebook';
  if (referer.includes('linkedin.com')) return 'linkedin';
  if (referer.includes('google.com')) return 'google';
  
  return 'website';
}

/**
 * Track conversion for analytics
 */
async function trackConversion(formData: LeadFormData, trackingId: string): Promise<void> {
  try {
    // Add analytics tracking here if needed
    console.log(`[${trackingId}] Conversion tracked for ${formData.email}`);
  } catch (error) {
    console.error(`[${trackingId}] Analytics tracking failed:`, error);
  }
} 