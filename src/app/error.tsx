'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
    
    // In production, you could send to error reporting service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error illustration */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-red-600" role="img" aria-label="Błąd aplikacji">
              ⚠️
            </span>
          </div>
        </div>

        {/* Error content */}
        <main>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ups! Coś poszło nie tak
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Wystąpił nieoczekiwany błąd
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Przepraszamy za niedogodności. Nasz zespół został powiadomiony o problemie 
            i pracuje nad jego rozwiązaniem.
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left bg-gray-100 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                Szczegóły błędu (tylko w trybie deweloperskim)
              </summary>
              <pre className="text-xs text-red-600 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              🔄 Spróbuj ponownie
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              ← Wróć na stronę główną
            </Link>
          </div>

          {/* Contact support */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Jeśli problem się powtarza, skontaktuj się z nami:
            </p>
            <div className="space-y-2">
              <a
                href="mailto:support@bezhandlowca.pl"
                className="inline-flex items-center text-sm text-red-600 hover:text-red-700 underline"
              >
                📧 support@bezhandlowca.pl
              </a>
              <br />
              <a
                href="tel:+48123456789"
                className="inline-flex items-center text-sm text-red-600 hover:text-red-700 underline"
              >
                📞 +48 123 456 789
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 