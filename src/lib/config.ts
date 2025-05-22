interface Config {
  google: {
    serviceAccountEmail: string;
    privateKey: string;
    sheetsId: string;
  };
  hubspot: {
    accessToken: string;
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  slack: {
    webhookUrl: string;
  };
  security: {
    rateLimit: {
      max: number;
      windowMs: number;
    };
  };
  app: {
    url: string;
    isDevelopment: boolean;
    version: string;
    isProduction: boolean;
  };
  analytics: {
    gaId: string;
    linkedinPixelId: string;
    hotjarId: string;
    hotjarVersion: number;
  };
  features: {
    enableAnalytics: boolean;
    enableLinkedinPixel: boolean;
    enableHotjar: boolean;
  };
}

export const config: Config = {
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    sheetsId: process.env.GOOGLE_SHEETS_ID || '',
  },
  hubspot: {
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN || '',
  },
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
    from: process.env.EMAIL_FROM || '',
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  },
  security: {
    rateLimit: {
      max: parseInt(process.env.RATE_LIMIT_MAX || '5', 10),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    },
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://handlowiec.pl',
    isDevelopment: process.env.NODE_ENV === 'development',
    version: process.env.APP_VERSION || '1.0.0',
    isProduction: process.env.NODE_ENV === 'production',
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    linkedinPixelId: process.env.NEXT_PUBLIC_LINKEDIN_PIXEL_ID || '',
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
    hotjarVersion: parseInt(process.env.NEXT_PUBLIC_HOTJAR_VERSION || '6', 10),
  },
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableLinkedinPixel: process.env.NEXT_PUBLIC_ENABLE_LINKEDIN_PIXEL === 'true',
    enableHotjar: process.env.NEXT_PUBLIC_ENABLE_HOTJAR === 'true',
  },
}; 