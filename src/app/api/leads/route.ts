import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/lib/validations';
import { googleSheetsService } from '@/services/googleSheets';
import { hubspotService } from '@/services/hubspot';
import { emailService } from '@/services/email';
import { slackService } from '@/services/slack';
import { createRateLimiter, extractUTMParams, generateTrackingId, sanitizeString } from '@/utils';
import { config } from '@/config';
import type { ApiResponse } from '@/types/api';
import type { LeadFormData } from '@/types/form';

// Rate limiter: max 5 submissions per 15 minutes per IP
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
  
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

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

    // Execute all integrations in parallel for speed
    const integrationPromises = [
      // Primary: Save to Google Sheets (critical)
      googleSheetsService.addLead(formData),
      
      // Secondary: Send notifications (important but not critical)
      emailService.sendLeadNotification(formData).catch(error => {
        console.error(`[${trackingId}] Email notification failed:`, error);
        return null;
      }),
      
      emailService.sendLeadConfirmation(formData).catch(error => {
        console.error(`[${trackingId}] Confirmation email failed:`, error);
        return null;
      }),
      
      slackService.sendLeadNotification(formData).catch(error => {
        console.error(`[${trackingId}] Slack notification failed:`, error);
        return null;
      }),
      
      // Tertiary: HubSpot CRM (optional)
      hubspotService.isIntegrationEnabled() 
        ? hubspotService.createContact(formData).catch(error => {
            console.error(`[${trackingId}] HubSpot integration failed:`, error);
            return null;
          })
        : Promise.resolve(null),
    ];

    // Wait for all integrations to complete
    const [sheetsResult, ...otherResults] = await Promise.all(integrationPromises);

    // Check if primary integration (Google Sheets) succeeded
    if (!sheetsResult.success) {
      throw new Error('Failed to save lead to primary storage');
    }

    // Log successful submission
    const processingTime = Date.now() - startTime;
    console.log(`[${trackingId}] Lead processed successfully in ${processingTime}ms`);

    // Track analytics event
    await trackConversion(formData, trackingId).catch(error => {
      console.error(`[${trackingId}] Analytics tracking failed:`, error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Dziękujemy! Twoje zgłoszenie zostało wysłane. Skontaktujemy się w ciągu 15 minut.',
        data: {
          trackingId,
          leadId: sheetsResult.rowId,
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

    // Send error notification to Slack
    slackService.sendErrorNotification(
      `Lead submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {
        trackingId,
        clientIp,
        error: error instanceof Error ? error.stack : error,
      }
    ).catch(slackError => {
      console.error('Failed to send error notification to Slack:', slackError);
    });

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
 * Detect traffic source from request headers
 */
function detectSource(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // Check for social media sources
  if (referer.includes('linkedin.com')) return 'linkedin';
  if (referer.includes('facebook.com')) return 'facebook';
  if (referer.includes('twitter.com') || referer.includes('t.co')) return 'twitter';
  
  // Check for search engines
  if (referer.includes('google.com')) return 'google';
  if (referer.includes('bing.com')) return 'bing';
  
  // Check for email clients
  if (userAgent.includes('Outlook') || userAgent.includes('Thunderbird')) return 'email';
  
  // Default to direct if no referer
  if (!referer || referer.includes(config.app.url)) return 'direct';
  
  return 'referral';
}

/**
 * Track conversion event for analytics
 */
async function trackConversion(formData: LeadFormData, trackingId: string): Promise<void> {
  try {
    // This would integrate with Google Analytics 4, LinkedIn Pixel, etc.
    // For now, just log the conversion
    console.log(`[${trackingId}] Conversion tracked for ${formData.email}`);
    
    // Future: Send to GA4, LinkedIn Conversion API, etc.
    // const analyticsData = {
    //   event_name: 'lead_form_submit',
    //   user_data: {
    //     email: formData.email,
    //     phone: formData.phone,
    //   },
    //   custom_data: {
    //     company: formData.company,
    //     source: formData.source,
    //   },
    // };
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
} 