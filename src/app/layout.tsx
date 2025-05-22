import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { LinkedInPixel } from '@/components/analytics/LinkedInPixel';
import { Hotjar } from '@/components/analytics/Hotjar';
import { config } from '@/lib/config';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const organizationSchema = {  "@context": "https://schema.org",  "@type": "Organization",  "name": "BezHandlowca Sp. z o.o.",  "alternateName": "BezHandlowca.pl",  "url": config.app.url,  "logo": `${config.app.url}/logo.svg`,  "description": "Sprzedaż B2B bez handlowca - przejmujemy cały proces sprzedaży za Ciebie",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Przykładowa 123",
    "addressLocality": "Warszawa",
    "postalCode": "00-001",
    "addressCountry": "PL"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+48-123-456-789",
    "contactType": "customer service",
    "areaServed": "PL",
    "availableLanguage": "Polish"
  },
  "sameAs": [
    "https://www.linkedin.com/company/handlowiec-pl"
  ],
  "founder": {
    "@type": "Person",
    "name": "Bartek Kowalski"
  },
  "foundingDate": "2024",
  "serviceArea": {
    "@type": "Country",
    "name": "Poland"
  }
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Outsourcing Sprzedaży B2B",
  "description": "Profesjonalny outsourcing sprzedaży B2B dla polskich MŚP. Lead generation, pipeline management, coaching handlowców.",
  "provider": {
    "@type": "Organization",
        "name": "BezHandlowca Sp. z o.o."  },  "areaServed": {    "@type": "Country",    "name": "Poland"  },  "category": "Business Consulting",  "offers": {    "@type": "Offer",    "description": "Sprzedaż B2B bez handlowca - bezpłatna konsultacja",    "url": config.app.url  }
};

export const metadata: Metadata = {
  metadataBase: new URL(config.app.url),
    title: {    default: 'BezHandlowca.pl - Sprzedaż B2B bez handlowca',    template: '%s | BezHandlowca.pl',  },  description: 'Zatrudniasz – szkolisz – tracisz? Zamknij drzwi obrotowe w sprzedaży. Przejmujemy cały proces sprzedaży B2B za Ciebie. Płacisz tylko za efekty. Zero kosztów stałych.',
    keywords: [    'sprzedaż bez handlowca',    'outsourcing sprzedaży',    'B2B',    'lead generation',    'rotacja handlowców',    'sprzedaż',    'MŚP',    'Polska',    'CRM',    'sales',    'pipeline',    'koszt handlowca',  ],  authors: [{ name: 'BezHandlowca.pl' }],  creator: 'BezHandlowca.pl',  publisher: 'BezHandlowca Sp. z o.o.',
  category: 'Business Services',
  classification: 'Sales Outsourcing',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: config.app.url,
        title: 'BezHandlowca.pl - Sprzedaż B2B bez handlowca',    description: 'Zatrudniasz – szkolisz – tracisz? Zamknij drzwi obrotowe w sprzedaży. Przejmujemy cały proces sprzedaży B2B za Ciebie.',    siteName: 'BezHandlowca.pl',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BezHandlowca.pl - Sprzedaż B2B bez handlowca',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
        title: 'BezHandlowca.pl - Sprzedaż B2B bez handlowca',    description: 'Zatrudniasz – szkolisz – tracisz? Zamknij drzwi obrotowe w sprzedaży.',
    images: ['/images/og-image.jpg'],
    creator: '@handlowiec_pl',
  },
  
  // SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Technical
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  
  // Verification
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  
  // Other
  alternates: {
    canonical: config.app.url,
    languages: {
      'pl-PL': config.app.url,
    },
  },

  // Structured Data
  other: {
    'application/ld+json': [
      JSON.stringify(organizationSchema),
      JSON.stringify(serviceSchema),
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
        >
          Przejdź do głównej treści
        </a>
        
        {/* Main content */}
        <div id="main-content" className="min-h-screen">
          {children}
        </div>
        
        {/* Analytics and tracking */}
        {config.features.enableAnalytics && config.analytics.gaId && (
          <GoogleAnalytics measurementId={config.analytics.gaId} />
        )}
        
        {config.features.enableLinkedinPixel && config.analytics.linkedinPixelId && (
          <LinkedInPixel pixelId={config.analytics.linkedinPixelId} />
        )}
        
        {config.features.enableHotjar && config.analytics.hotjarId && (
          <Hotjar 
            siteId={config.analytics.hotjarId} 
            version={config.analytics.hotjarVersion} 
          />
        )}
        
        {/* Vercel Analytics */}
        <Analytics />
        
        {/* Performance optimization */}
        {config.app.isProduction && (
          <>
            {/* Resource hints */}
            <link rel="prefetch" href="/images/hero-bg.jpg" />
            <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          </>
        )}
      </body>
    </html>
  );
} 