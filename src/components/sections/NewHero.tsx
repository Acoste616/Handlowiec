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

export default function NewHero() {
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
          source: 'hero-form'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (isSubmitted) {
    return (
      <section id="rotacja" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-white p-12 rounded-2xl shadow-large animate-fade-in">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dziękujemy za zgłoszenie!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Twoje zgłoszenie zostało wysłane. Oddzwonimy w ciągu 24 godzin.
            </p>
            <p className="text-sm text-gray-500">
              Przekierowujemy Cię na stronę podziękowania...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rotacja" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Content */}
        <div className="text-center lg:text-left animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Zatrudniasz – szkolisz –{' '}
            <span className="text-secondary-500">tracisz?</span>
            <br />
            Zamknij drzwi obrotowe w sprzedaży.
          </h1>

          <div className="mb-8">
            <div className="bg-secondary-50 border-l-4 border-secondary-500 p-6 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-3xl font-bold text-secondary-500">20–30%</span>
                <span className="text-lg text-gray-700 ml-2">rotacja handlowców rocznie w Polsce</span>
              </div>
              <p className="text-gray-600">
                Średni koszt rekrutacji i wdrożenia handlowca: <strong>50 000 zł</strong>
              </p>
            </div>
          </div>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Przejmujemy <strong>cały proces sprzedaży</strong> za Ciebie.
            <br />
            Płacisz tylko za efekty. Zero kosztów stałych.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
            <div className="flex items-center text-gray-600">
              <span className="w-5 h-5 bg-secondary-500 rounded-full mr-2"></span>
              Brak ryzyka
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-5 h-5 bg-secondary-500 rounded-full mr-2"></span>
              Szybkie wdrożenie
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-5 h-5 bg-secondary-500 rounded-full mr-2"></span>
              Płatność za efekty
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-white p-8 rounded-2xl shadow-large animate-slide-in-right">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Chcę sprzedaży bez handlowca
            </h3>
            <p className="text-gray-600">
              Umów bezpłatną konsultację (30 min)
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Twój email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                required
                className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="consent" className="text-sm text-gray-600">
                Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  polityką prywatności
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

            <p className="text-xs text-gray-500 text-center">
              🔒 Twoje dane są bezpieczne. Żadnego spamu.
              <br />
              📞 Oddzwonimy w ciągu 24h z linkiem do kalendarza.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
} 