import { NextResponse } from 'next/server';
import { googleSheetsService } from '@/services/googleSheets';
import { hubspotService } from '@/services/hubspot';
import { emailService } from '@/services/email';
import { slackService } from '@/services/slack';
import { config } from '@/lib/config';
import type { HealthCheckResponse } from '@/types/api';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();
  
  try {
    // Test all service connections in parallel
    const [
      googleSheetsStatus,
      hubspotStatus,
      emailStatus,
      slackStatus,
    ] = await Promise.allSettled([
      googleSheetsService.testConnection(),
      hubspotService.testConnection(),
      emailService.testConnection(),
      slackService.testConnection(),
    ]);

    const services = {
      database: 'connected' as const, // Using Google Sheets as primary DB
      email: emailStatus.status === 'fulfilled' && emailStatus.value 
        ? 'connected' as const 
        : 'disconnected' as const,
      googleSheets: googleSheetsStatus.status === 'fulfilled' && googleSheetsStatus.value 
        ? 'connected' as const 
        : 'disconnected' as const,
      hubspot: hubspotService.isIntegrationEnabled() 
        ? (hubspotStatus.status === 'fulfilled' && hubspotStatus.value 
            ? 'connected' as const 
            : 'disconnected' as const)
        : 'connected' as const, // Consider disabled as healthy
      slack: slackService.isIntegrationEnabled()
        ? (slackStatus.status === 'fulfilled' && slackStatus.value 
            ? 'connected' as const 
            : 'disconnected' as const)
        : 'connected' as const, // Consider disabled as healthy
    };

    // Determine overall health status
    const criticalServices = ['googleSheets', 'email'] as const;
    const isCriticalServiceDown = criticalServices.some(
      service => services[service] === 'disconnected'
    );

    const overallStatus = isCriticalServiceDown ? 'unhealthy' : 'healthy';
    const responseTime = Date.now() - startTime;

    const response: HealthCheckResponse = {
      status: overallStatus,
      services,
      timestamp: new Date().toISOString(),
      version: config.app.version,
    };

    // Log health check
    console.log(`Health check completed in ${responseTime}ms - Status: ${overallStatus}`);

    return NextResponse.json(response, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    const response: HealthCheckResponse = {
      status: 'unhealthy',
      services: {
        database: 'disconnected',
        email: 'disconnected',
        googleSheets: 'disconnected',
        hubspot: 'disconnected',
        slack: 'disconnected',
      },
      timestamp: new Date().toISOString(),
      version: config.app.version,
    };

    return NextResponse.json(response, { status: 503 });
  }
}

/**
 * Detailed health check for monitoring systems
 * GET /api/health?detailed=true
 */
export async function HEAD(): Promise<NextResponse> {
  try {
    // Quick ping without running full health checks
    const isHealthy = await googleSheetsService.testConnection();
    
    return NextResponse.json(
      { status: isHealthy ? 'ok' : 'error' },
      { status: isHealthy ? 200 : 503 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error' },
      { status: 503 }
    );
  }
} 