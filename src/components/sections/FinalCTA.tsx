'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export default function FinalCTA() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    company: '',
    email: '',
    phone: '',
    message: 'Chcę umówić bezpłatną konsultację w sprawie outsourcingu sprzedaży.',
    consent: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.firstName.trim()) {
      setError('Imię jest wymagane');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email jest wymagany');
      setIsSubmitting(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('Telefon jest wymagany');
      setIsSubmitting(false);
      return;
    }

    if (!formData.consent) {
      setError('Zgoda na przetwarzanie danych jest wymagana');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'final-cta'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push('/thank-you');
        }, 2000);
      } else {
        setError(result.message || 'Wystąpił błąd podczas wysyłania formularza');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="final-cta" className="py-20 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">
              Doskonale! Jesteś już na liście.
            </h2>
            <p className="text-xl mb-6">
              Twoje zgłoszenie zostało wysłane. Oddzwonimy w ciągu 24 godzin.
            </p>
            <div className="bg-white/10 p-6 rounded-lg">
              <p className="text-lg font-semibold mb-2">Co dalej?</p>
              <p className="text-sm">
                📞 Oddzwonimy w ciągu 24h z potwierdzeniem<br />
                📅 Umówimy dokładny termin konsultacji<br />
                📊 Przygotujemy wstępną analizę Twojej branży
              </p>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Przekierowujemy Cię na stronę podziękowania...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="final-cta" className="py-20 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Chcę sprzedaży <br />
              <span className="text-primary-100">bez handlowca</span>
            </h2>
            
            <div className="space-y-4 mb-8 text-xl">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full mr-3 flex items-center justify-center text-secondary-100 text-sm">✓</span>
                <span>Bez ryzyka, bez kosztów stałych</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full mr-3 flex items-center justify-center text-secondary-100 text-sm">✓</span>
                <span>Płacisz tylko za efekty</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-white/20 rounded-full mr-3 flex items-center justify-center text-secondary-100 text-sm">✓</span>
                <span>Pierwsze leady w ciągu 30 dni</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-8">
              <p className="text-lg font-semibold mb-2">💡 Bezpłatna konsultacja obejmuje:</p>
              <ul className="text-base space-y-1">
                <li>• Analizę Twojej obecnej sytuacji w sprzedaży</li>
                <li>• Wstępną ocenę potencjału w Twojej branży</li>
                <li>• Konkretny plan działania na pierwsze 90 dni</li>
                <li>• Transparentną kalkulację kosztów i ROI</li>
              </ul>
            </div>

            <p className="text-lg opacity-90">
              <strong>Zero zobowiązań.</strong> Jeśli uznasz, że to nie dla Ciebie - po prostu się rozejdziemy. 
              Nie tracimy czasu na przekonywanie, jeśli nie ma dobrego fitu.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-large">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Umów bezpłatną konsultację
              </h3>
              <p className="text-gray-600">
                30 minut, które mogą zmienić Twoją sprzedaż
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Twoje imię"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Nazwa firmy"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Twój email służbowy"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Numer telefonu"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Dodatkowe informacje (opcjonalnie)"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="consent"
                  id="consent-final"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                  className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="consent-final" className="text-sm text-gray-600">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                  <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                    polityką prywatności
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary-500 text-white py-4 px-6 rounded-lg font-semibold text-xl hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie...
                  </div>
                ) : (
                  'Umów konsultację (0 zł)'
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-2">
                  🔒 Twoje dane są w 100% bezpieczne
                </p>
                <p className="text-sm text-gray-600">
                  📞 <strong>Zadzwonimy w ciągu 24h</strong> z linkiem do kalendarza<br />
                  📧 Otrzymasz potwierdzenie na email<br />
                  ⏰ Konsultacja trwa 30 minut
                </p>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Preferujesz zadzwonić? <br />
                <span className="font-semibold text-gray-700">+48 123 456 789</span>
              </p>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-16 text-center">
          <p className="text-white/80 mb-6">Dołącz do 100+ firm, które już korzystają z BezHandlowca.pl</p>
          <div className="flex justify-center items-center space-x-8 text-white/60">
            <div className="text-4xl">🏢</div>
            <div className="text-4xl">🏭</div>
            <div className="text-4xl">💻</div>
            <div className="text-4xl">⚡</div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
      </div>
    </section>
  );
} 