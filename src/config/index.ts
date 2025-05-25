export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'BezHandlowca',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://bezhandlowca.pl',
    description: 'Profesjonalny outsourcing sprzedaży B2B dla polskich MŚP',
    version: '1.0.0',
  },
  
  google: {
    sheetsId: process.env.GOOGLE_SHEETS_ID || '',
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  },
  
  hubspot: {
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN || '',
    portalId: process.env.HUBSPOT_PORTAL_ID || '',
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'leads@bezhandlowca.pl',
    to: process.env.EMAIL_TO || 'leads@bezhandlowca.pl',
  },
  
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  },
  
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    linkedinPixelId: process.env.NEXT_PUBLIC_LINKEDIN_PIXEL_ID || '',
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
    hotjarVersion: parseInt(process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6'),
  },
  
  security: {
    formSecretKey: process.env.FORM_SECRET_KEY || 'default-secret-key',
    rateLimit: {
      max: parseInt(process.env.RATE_LIMIT_MAX || '5'),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    },
  },
  
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableHotjar: process.env.NEXT_PUBLIC_ENABLE_HOTJAR === 'true',
    enableLinkedinPixel: process.env.NEXT_PUBLIC_ENABLE_LINKEDIN_PIXEL === 'true',
  },
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate required environment variables
export function validateConfig() {
  const requiredVars = [
    'GOOGLE_SHEETS_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'SMTP_USER',
    'SMTP_PASSWORD',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0 && config.isProduction) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
} 