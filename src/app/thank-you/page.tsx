import { Metadata } from 'next';
import Link from 'next/link';
import { getEstimatedResponseTime } from '@/utils';

export const metadata: Metadata = {
  title: 'Dziękujemy za zgłoszenie | Handlowiec.pl',
  description: 'Twoje zgłoszenie zostało wysłane pomyślnie. Skontaktujemy się z Tobą najszybciej jak to możliwe.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const estimatedResponseTime = getEstimatedResponseTime();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Dziękujemy za zgłoszenie!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Twoja wiadomość została wysłana pomyślnie. 
          <br />
          Nasz zespół skontaktuje się z Tobą <strong>{estimatedResponseTime}</strong>.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 text-left max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Co dalej?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium mr-3 mt-0.5">
                1
              </span>
              <span>
                Sprawdzamy Twoje zgłoszenie i przygotowujemy analizę potrzeb
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium mr-3 mt-0.5">
                2
              </span>
              <span>
                Dzwonimy lub wysyłamy email z propozycją terminu rozmowy
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium mr-3 mt-0.5">
                3
              </span>
              <span>
                Omawiamy Twoje potrzeby i przedstawiamy dedicated propozycję
              </span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="bg-primary-900 text-white rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Masz pilną sprawę?
          </h3>
          <p className="text-primary-100 mb-4">
            Zadzwoń bezpośrednio lub napisz na email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+48123456789"
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-primary-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              📞 +48 123 456 789
            </a>
            <a 
              href="mailto:kontakt@handlowiec.pl"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary-800 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              ✉️ kontakt@handlowiec.pl
            </a>
          </div>
        </div>

        {/* Back to homepage */}
        <Link 
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          ← Wróć na stronę główną
        </Link>

        {/* Social proof reminder */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            Dołącz do 50+ firm, które już zwiększyły sprzedaż z Handlowiec.pl
          </p>
        </div>
      </div>
    </div>
  );
} 