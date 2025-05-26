'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export default function KontaktPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'kontakt-page',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        // Redirect to qualification page with leadId
        setTimeout(() => {
          window.location.href = `/kwalifikacja?leadId=${result.data?.leadId}`;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dziękujemy!
          </h2>
          <p className="text-gray-600 mb-6">
            Twoje zgłoszenie zostało wysłane. Skontaktujemy się z Tobą w ciągu 15 minut.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Wyślij kolejne zgłoszenie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">BezHandlowca.pl</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Strona główna
              </a>
              <a href="/kontakt" className="text-blue-600 font-medium">
                Kontakt
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Skontaktuj się z nami
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Jesteś gotowy na zwiększenie sprzedaży? Skontaktuj się z nami już dziś 
              i dowiedz się, jak możemy pomóc Twojej firmie osiągnąć lepsze wyniki.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Telefon</h3>
                  <p className="text-gray-600">+48 123 456 789</p>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">kontakt@bezhandlowca.pl</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Adres</h3>
                  <p className="text-gray-600">Warszawa, Polska</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Godziny pracy</h3>
                  <p className="text-gray-600">Pon-Pt: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">
                Szybka odpowiedź gwarantowana
              </h3>
              <p className="text-blue-700">
                Odpowiadamy na wszystkie zapytania w ciągu 15 minut w godzinach pracy.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Wyślij zapytanie
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jan Kowalski"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa firmy *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Twoja Firma Sp. z o.o."
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="jan@twojafirma.pl"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Wiadomość *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Opisz swoje potrzeby i oczekiwania..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wysyłanie...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Wyślij zapytanie
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-500 text-center">
              * Pola wymagane. Twoje dane są bezpieczne i nie będą udostępniane osobom trzecim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 