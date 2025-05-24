'use client';

import { useState } from 'react';

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  company: string;
  consent: boolean;
}

export default function CaseStudyLeadMagnet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ email: '', phone: '', firstName: '', company: '', consent: false });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

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
          message: 'Proszę o przesłanie case study dotyczącego zwiększenia liczby leadów o 6x w 90 dni.',
          source: 'case-study-lead-magnet'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        // Auto-close modal after success
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setFormData({ firstName: '', company: '', email: '', phone: '', consent: false });
        }, 3000);
      } else {
        setError(result.message || 'Wystąpił błąd podczas wysyłania formularza');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData({ email: '', phone: '', firstName: '', company: '', consent: false });
  };

  return (
    <>
      <section id="case-study" className="py-20 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Zobacz case study: <br />
                <span className="text-secondary-500">6× więcej leadów w 90 dni</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-secondary-500 rounded-full mr-3 flex items-center justify-center text-white text-sm">✓</span>
                  <span className="text-lg">Jak firma IT zwiększyła liczbę leadów z 20 do 120/miesiąc</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-secondary-500 rounded-full mr-3 flex items-center justify-center text-white text-sm">✓</span>
                  <span className="text-lg">Dokładny proces, narzędzia i strategie</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-secondary-500 rounded-full mr-3 flex items-center justify-center text-white text-sm">✓</span>
                  <span className="text-lg">Konkretne liczby: koszty, ROI, timeline</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-secondary-500 rounded-full mr-3 flex items-center justify-center text-white text-sm">✓</span>
                  <span className="text-lg">Sprawdzone na polskim rynku B2B</span>
                </div>
              </div>

              <button
                onClick={openModal}
                className="bg-secondary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Pobierz case study za darmo
              </button>
            </div>

            {/* Visual */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-2xl font-bold mb-4">
                  Proven Results
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-500 mb-2">6×</div>
                    <p className="text-sm">Więcej leadów</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-500 mb-2">90</div>
                    <p className="text-sm">Dni do efektu</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-500 mb-2">45%</div>
                    <p className="text-sm">Mniej kosztów</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-500 mb-2">0</div>
                    <p className="text-sm">Ryzyka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Dziękujemy!
                </h3>
                <p className="text-gray-600 mb-4">
                  Case study zostało wysłane na Twój email.
                </p>
                <p className="text-sm text-gray-500">
                  Sprawdź także spam/promotional folder.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Pobierz case study
                  </h3>
                  <p className="text-gray-600">
                    6× więcej leadów w 90 dni - konkretne liczby i strategie
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
                      placeholder="Imię"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="consent"
                      id="consent-case-study"
                      checked={formData.consent}
                      onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                      required
                      disabled={isSubmitting}
                      className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="consent-case-study" className="text-sm text-gray-600">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                      <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                        polityką prywatności
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wysyłanie...
                      </div>
                    ) : (
                      'Wyślij case study'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    🔒 Twoje dane są bezpieczne. Żadnego spamu.
                    <br />
                    📧 Case study otrzymasz w ciągu 2 minut.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 