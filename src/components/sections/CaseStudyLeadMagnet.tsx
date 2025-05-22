'use client';

import { useState } from 'react';

interface FormData {
  email: string;
  phone: string;
}

export default function CaseStudyLeadMagnet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form submission logic
    setIsSubmitted(true);
    
    // Auto-trigger follow-up
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ email: '', phone: '' });
      // TODO: Add auto-email with calendar link
    }, 3000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData({ email: '', phone: '' });
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Twój email służbowy"
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
                    className="w-full bg-secondary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-600 transition-colors"
                  >
                    Wyślij case study
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