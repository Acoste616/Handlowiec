import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Polityka Prywatności | Handlowiec.pl',
  description: 'Polityka prywatności Handlowiec.pl - informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Polityka Prywatności
          </h1>
          <p className="text-xl text-primary-100">
            Informacje o przetwarzaniu danych osobowych
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          {/* Administrator danych */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Administrator danych osobowych
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Handlowiec Sp. z o.o.</strong>
              </p>
              <p className="mb-2">
                ul. Przykładowa 123<br />
                00-001 Warszawa
              </p>
              <p className="mb-2">
                Email: <a href="mailto:kontakt@handlowiec.pl" className="text-primary-600">kontakt@handlowiec.pl</a><br />
                Telefon: <a href="tel:+48123456789" className="text-primary-600">+48 123 456 789</a>
              </p>
            </div>
          </section>

          {/* Zakres przetwarzania */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Zakres przetwarzania danych osobowych
            </h2>
            <p className="mb-4">
              Przetwarzamy następujące kategorie danych osobowych:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Dane identyfikacyjne (imię, nazwisko)</li>
              <li>Dane kontaktowe (adres email, numer telefonu)</li>
              <li>Dane dotyczące firmy (nazwa firmy, stanowisko)</li>
              <li>Treść wiadomości przesłanej przez formularz</li>
              <li>Dane techniczne (adres IP, user-agent przeglądarki)</li>
              <li>Dane analityczne (Google Analytics, LinkedIn Pixel, Hotjar)</li>
            </ul>
          </section>

          {/* Cele przetwarzania */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Cele i podstawy prawne przetwarzania
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Obsługa zapytań klientów
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>Podstawa prawna:</strong> zgoda (art. 6 ust. 1 lit. a RODO)
                </p>
                <p className="text-gray-600">
                  Przetwarzamy dane w celu odpowiedzi na zapytania przesłane przez formularz kontaktowy.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Marketing bezpośredni
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>Podstawa prawna:</strong> prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO)
                </p>
                <p className="text-gray-600">
                  Kontaktujemy się z potencjalnymi klientami w zakresie naszych usług.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Analityka i optymalizacja strony
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>Podstawa prawna:</strong> prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO)
                </p>
                <p className="text-gray-600">
                  Używamy narzędzi analitycznych do optymalizacji funkcjonowania strony.
                </p>
              </div>
            </div>
          </section>

          {/* Okres przechowywania */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Okres przechowywania danych
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dane z formularza kontaktowego:</strong> 2 lata od ostatniego kontaktu
              </li>
              <li>
                <strong>Dane analityczne:</strong> zgodnie z polityką Google Analytics (26 miesięcy)
              </li>
              <li>
                <strong>Dane w celach marketingowych:</strong> do momentu cofnięcia zgody lub wniesienia sprzeciwu
              </li>
            </ul>
          </section>

          {/* Odbiorcy danych */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Odbiorcy danych osobowych
            </h2>
            <p className="mb-4">
              Twoje dane osobowe mogą być przekazywane następującym odbiorcom:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google LLC (Google Analytics, Google Sheets)</li>
              <li>Microsoft Corporation (LinkedIn Pixel)</li>
              <li>Hotjar Ltd. (analiza zachowań użytkowników)</li>
              <li>HubSpot Inc. (system CRM)</li>
              <li>Slack Technologies (powiadomienia wewnętrzne)</li>
              <li>Vercel Inc. (hosting strony internetowej)</li>
            </ul>
          </section>

          {/* Prawa */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Twoje prawa
            </h2>
            <p className="mb-4">
              Przysługują Ci następujące prawa:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Prawo dostępu</h3>
                <p className="text-sm text-gray-600">
                  Możesz uzyskać informacje o przetwarzanych danych
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Prawo sprostowania</h3>
                <p className="text-sm text-gray-600">
                  Możesz żądać poprawienia nieprawidłowych danych
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Prawo usunięcia</h3>
                <p className="text-sm text-gray-600">
                  Możesz żądać usunięcia swoich danych
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Prawo sprzeciwu</h3>
                <p className="text-sm text-gray-600">
                  Możesz sprzeciwić się przetwarzaniu danych
                </p>
              </div>
            </div>
          </section>

          {/* Pliki cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Pliki cookies
            </h2>
            <p className="mb-4">
              Nasza strona używa plików cookies w celu:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Zapewnienia prawidłowego funkcjonowania strony</li>
              <li>Analizy ruchu na stronie (Google Analytics)</li>
              <li>Remarketing w serwisach społecznościowych</li>
              <li>Personalizacji treści</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Możesz zarządzać ustawieniami cookies w swojej przeglądarce.
            </p>
          </section>

          {/* Kontakt */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Kontakt w sprawach ochrony danych
            </h2>
            <div className="bg-primary-50 p-6 rounded-lg">
              <p className="mb-4">
                W przypadku pytań dotyczących przetwarzania danych osobowych, skontaktuj się z nami:
              </p>
              <div className="space-y-2">
                <p>
                  📧 Email: <a href="mailto:privacy@handlowiec.pl" className="text-primary-600 font-medium">privacy@handlowiec.pl</a>
                </p>
                <p>
                  📞 Telefon: <a href="tel:+48123456789" className="text-primary-600 font-medium">+48 123 456 789</a>
                </p>
                <p>
                  📮 Adres: ul. Przykładowa 123, 00-001 Warszawa
                </p>
              </div>
            </div>
          </section>

          {/* Data aktualizacji */}
          <section className="mb-12">
            <div className="border-t pt-8">
              <p className="text-sm text-gray-500">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
} 