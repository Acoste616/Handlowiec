import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strona nie została znaleziona | BezHandlowca.pl',
  description: 'Przepraszamy, ale strona której szukasz nie istnieje. Wróć na stronę główną lub skontaktuj się z nami.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error illustration */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-red-600" role="img" aria-label="Błąd 404">
              🔍
            </span>
          </div>
        </div>

        {/* Error content */}
        <main>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Strona nie została znaleziona
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona. 
            Sprawdź adres URL lub wróć na stronę główną.
          </p>

          {/* Action buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              ← Wróć na stronę główną
            </Link>
            
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Skontaktuj się z nami
            </Link>
          </div>

          {/* Additional help */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Popularne strony:
            </h3>
            <nav aria-label="Popularne strony">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/#services" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Nasze usługi
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#process" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Jak działamy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#faq" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Często zadawane pytania
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Polityka prywatności
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
} 