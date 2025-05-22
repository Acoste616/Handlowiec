'use client';

import { useState } from 'react';

interface FormData {
  email: string;
  phone: string;
}

export default function NewHero() {
  const [formData, setFormData] = useState<FormData>({ email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form submission logic
    setIsSubmitted(true);
    
    // Auto-trigger follow-up
    setTimeout(() => {
      // TODO: Add auto-email with calendar link
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
              Sprawdź email - wysłaliśmy Ci link do kalendarza, żeby umówić demo.
            </p>
            <p className="text-sm text-gray-500">
              Lead nie będzie czekać dłużej niż 1 dzień.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Twój email"
                value={formData.email}
                onChange={handleInputChange}
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-secondary-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Umów konsultację (0 zł)
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