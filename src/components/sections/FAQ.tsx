'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Ile kosztuje outsourcing sprzedaży B2B?",
      answer: "Koszt zależy od skali projektu i wybranego modelu współpracy. Oferujemy elastyczne modele: prowizyjny, mieszany lub stały. Średni ROI naszych klientów to 1:5, co oznacza, że na każde wydane 1000 zł generujemy 5000 zł przychodu."
    },
    {
      question: "Jak długo trwa wdrożenie?",
      answer: "Standardowy proces wdrożenia trwa 2-4 tygodnie. W tym czasie dobieramy zespół, przeprowadzamy szkolenia i ustalamy KPI. Pierwsze wyniki widoczne są już po 30-45 dniach."
    },
    {
      question: "Czy mogę zrezygnować z usługi?",
      answer: "Tak, współpraca może być zakończona z zachowaniem 30-dniowego okresu wypowiedzenia. Nie ma długoterminowych zobowiązań ani ukrytych kosztów."
    },
    {
      question: "Jak wygląda komunikacja i raportowanie?",
      answer: "Każdy klient ma dedykowanego opiekuna, z którym komunikuje się na co dzień. Raporty są dostarczane tygodniowo i miesięcznie, a spotkania podsumowujące odbywają się co kwartał."
    },
    {
      question: "Czy handlowcy znają moją branżę?",
      answer: "Tak, dobieramy handlowców z doświadczeniem w Twojej branży. Każdy przechodzi szkolenie z Twoich produktów i procesów, a także regularnie podnosi kwalifikacje."
    },
    {
      question: "Jakie są gwarancje jakości?",
      answer: "Gwarantujemy jakość leadów i transparentność działań. Każdy lead jest weryfikowany i kwalifikowany. W przypadku braku wyników, modyfikujemy strategię lub zwracamy część opłaty."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Często zadawane pytania
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Odpowiedzi na najczęstsze pytania o outsourcing sprzedaży B2B
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 last:border-0"
          >
            <button
              className="w-full py-6 text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <span className="ml-6 flex-shrink-0">
                  <svg
                    className={`w-6 h-6 transform ${
                      openIndex === index ? 'rotate-180' : ''
                    } transition-transform duration-200`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </button>
            {openIndex === index && (
              <div className="pb-6">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-8">
          Nie znalazłeś odpowiedzi na swoje pytanie?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Skontaktuj się z nami
        </a>
      </div>
    </div>
  );
} 