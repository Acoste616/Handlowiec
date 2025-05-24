'use client';

import { useState } from 'react';
import { scrollToContact } from '@/lib/scroll';

interface FAQItem {
  question: string;
  answer: string;
  category: 'security' | 'cost' | 'process' | 'results' | 'requirements';
}

export default function NewFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First question open by default

  const faqItems: FAQItem[] = [
    {
      question: "Czy zewnętrzna firma zabierze mi klientów?",
      answer: "Absolutnie nie. Pracujemy w Twoim imieniu, wszystkie kontakty i relacje pozostają Twoje. Umowa precyzyjnie określa, że klienci należą do Ciebie. Nasze wynagrodzenie zależy od Twojego sukcesu, więc zależy nam na długoterminowej współpracy, nie na przejmowaniu klientów.",
      category: 'security'
    },
    {
      question: "Ile to kosztuje w porównaniu z etatowym przedstawicielem handlowym?",
      answer: "Średnio 40-60% mniej niż etatowy przedstawiciel handlowy. Nie płacisz ZUS, PPK, urlopów, zwolnień czy kosztów rekrutacji. Płacisz tylko za wygenerowane leady lub zamknięte kontrakty. Brak ryzyka, brak kosztów stałych.",
      category: 'cost'
    },
    {
      question: "Jak szybko mogę zobaczyć pierwsze rezultaty?",
      answer: "Pierwsze leady zazwyczaj w ciągu 2-4 tygodni. Pełną moc widzisz po 90 dniach, gdy proces się ustabilizuje. W przeciwieństwie do zatrudnienia handlowca (6+ miesięcy wdrożenia), my startujemy od razu z gotowym zespołem i procesami.",
      category: 'results'
    },
    {
      question: "W jakich branżach pracujecie?",
      answer: "Specjalizujemy się w B2B: IT, finanse, produkcja, usługi profesjonalne, e-commerce B2B. Mamy doświadczenie w sprzedaży produktów i usług od 10 000 zł do 500 000+ zł. Każdy projekt poprzedzamy analizą, czy Twoja branża to dobry fit.",
      category: 'requirements'
    },
    {
      question: "Jak wygląda model współpracy?",
      answer: "3 modele: 1) Płatność za lead (500-2000 zł/lead), 2) Prowizja od sprzedaży (8-15%), 3) Model hybrydowy. Wybieramy optymalny dla Twojej branży i cyklu sprzedaży. Umowa na 6-12 miesięcy z okresem wypowiedzenia.",
      category: 'process'
    },
    {
      question: "Co jeśli nie będzie efektów?",
      answer: "Masz gwarancję minimum leadów w umowie. Jeśli ich nie osiągniemy, przedłużamy współpracę za darmo lub zwracamy pieniądze. W 3 latach pracy mieliśmy 2 takie przypadki na 100+ projektów. Nasze wynagrodzenie zależy od Twoich efektów.",
      category: 'results'
    },
    {
      question: "Czy muszę udostępnić wrażliwe dane firmowe?",
      answer: "Nie. Potrzebujemy tylko podstawowych informacji o produkcie/usłudze, grupie docelowej i procesie sprzedaży. Wszystko objęte NDA. Dostęp tylko do niezbędnych systemów (CRM, kalendarz). Pełna transparentność działań bez ujawniania sekretów.",
      category: 'security'
    },
    {
      question: "Jakie są wymagania techniczne?",
      answer: "Minimum: CRM (możemy pomóc w wyborze), kalendarz online, basic landing page. Jeśli nie masz - pomożemy to skonfigurować. Większość klientów startuje z tym, co ma. Inwestujemy w narzędzia stopniowo, w miarę wzrostu.",
      category: 'requirements'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryIcon = (category: FAQItem['category']) => {
    switch (category) {
      case 'security': return '🔒';
      case 'cost': return '💰';
      case 'process': return '⚙️';
      case 'results': return '📈';
      case 'requirements': return '📋';
      default: return '❓';
    }
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Najczęstsze pytania i wątpliwości
          </h2>
          <p className="text-xl text-gray-600">
            Odpowiadamy na obawy, które słyszymy od każdego CEO
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-4">
                    {getCategoryIcon(item.category)}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="pl-12">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white p-8 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Masz inne pytania?
          </h3>
          <p className="text-gray-600 mb-6">
            Umów bezpłatną konsultację - odpowiemy na wszystkie wątpliwości
          </p>
          <button 
            onClick={scrollToContact}
            className="bg-secondary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105"
          >
            Umów rozmowę (30 min)
          </button>
        </div>
      </div>
    </section>
  );
} 