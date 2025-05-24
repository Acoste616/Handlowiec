'use client';

import { useState, useEffect } from 'react';
import { scrollToContact, scrollToCostCalculator, scrollToFAQ } from '@/lib/scroll';

interface PainSectionProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  statistic: {
    number: string;
    description: string;
  };
  roi: string;
  ctaText: string;
}

const PainSection = ({ id, icon, title, description, statistic, roi, ctaText }: PainSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate number counter
          const targetNumber = parseInt(statistic.number.replace(/\D/g, ''));
          if (targetNumber) {
            let current = 0;
            const increment = targetNumber / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= targetNumber) {
                setAnimatedNumber(targetNumber);
                clearInterval(timer);
              } else {
                setAnimatedNumber(Math.floor(current));
              }
            }, 30);
          }
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(id);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [id, statistic.number]);

  const handleCTAClick = (id: string) => {
    switch (id) {
      case 'kompetencje':
      case 'lejek':
      case 'kontrola':
      case 'skalowanie':
        scrollToContact();
        break;
      case 'koszty':
        scrollToCostCalculator();
        break;
      default:
        scrollToContact();
    }
  };

  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-4">{icon}</div>
              <h2 className="text-3xl font-bold text-gray-900">
                {title}
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            <button 
              onClick={() => handleCTAClick(id)}
              className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors"
            >
              {ctaText}
            </button>
          </div>

          {/* Stats & ROI */}
          <div className={`bg-gray-50 p-8 rounded-2xl transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-secondary-500 mb-2">
                {animatedNumber > 0 ? 
                  statistic.number.includes('%') ? `${animatedNumber}%` : 
                  statistic.number.includes('zł') ? `${animatedNumber.toLocaleString()} zł` :
                  `${animatedNumber}` 
                  : statistic.number
                }
              </div>
              <p className="text-gray-700 font-medium">
                {statistic.description}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border-l-4 border-secondary-500">
              <h4 className="font-semibold text-gray-900 mb-2">Wpływ na Twój biznes:</h4>
              <p className="text-gray-600">{roi}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function PainSections() {
  const painPoints: PainSectionProps[] = [
    {
      id: 'kompetencje',
      icon: '🎯',
      title: 'Brak kompetencji? Handlowcy uczą się na Twoim budżecie',
      description: 'Zatrudniasz kogoś z CV, ale dopiero po 6 miesiącach wiesz, czy umie sprzedawać. W międzyczasie tracisz kontrakty i reputację.',
      statistic: {
        number: '6',
        description: 'miesięcy średni czas wdrożenia handlowca w Polsce'
      },
      roi: 'Utracone kontrakty w tym czasie mogą kosztować Cię nawet 200 000 zł przychodu.',
      ctaText: 'Zobacz, jak to zatrzymać'
    },
    {
      id: 'lejek',
      icon: '📉',
      title: 'Twój lejek sprzedaży dziura jak sito?',
      description: 'Leadów jest mało, konwersja słaba, a proces sprzedaży nie istnieje. Każdy przedstawiciel handlowy robi to po swojemu, bez systemu i kontroli.',
      statistic: {
        number: '3',
        description: 'z 10 polskich firm B2B nie ma udokumentowanego procesu sprzedaży'
      },
      roi: 'Brak systemu sprzedaży może obniżać Twoją konwersję nawet o 40%.',
      ctaText: 'Chcę gotowy system'
    },
    {
      id: 'koszty',
      icon: '💸',
      title: 'Koszty rosną, a wyniki nie?',
      description: 'Pensja, ZUS, PPK, prowizje, szkolenia, narzędzia. Jeden przedstawiciel handlowy to koszt 15 000+ zł miesięcznie, a nie zawsze przynosi zysk.',
      statistic: {
        number: '180000',
        description: 'zł roczny koszt jednego handlowca (z ZUS i prowizjami)'
      },
      roi: 'Bez gwarancji efektów. U nas płacisz tylko za wyniki.',
      ctaText: 'Sprawdź kalkulację'
    },
    {
      id: 'kontrola',
      icon: '📊',
      title: 'Brak kontroli nad sprzedażą?',
      description: 'Nie wiesz, co robią Twoi handlowcy, ile czasu spędzają na rzeczywistej sprzedaży, ani dlaczego nie osiągają celów.',
      statistic: {
        number: '60',
        description: '% czasu handlowców nie poświęca na rzeczywistą sprzedaż'
      },
      roi: 'Brak transparentności może kosztować Cię 50% potencjalnych przychodów.',
      ctaText: 'Chcę mieć kontrolę'
    },
    {
      id: 'skalowanie',
      icon: '📈',
      title: 'Skalowanie sprzedaży to koszmar?',
      description: 'Każdy nowy przedstawiciel handlowy to kolejne miesiące rekrutacji, wdrożenia i ryzyka. A co jeśli po roku i tak odejdzie?',
      statistic: {
        number: '4',
        description: 'miesiące średni czas rekrutacji i wdrożenia handlowca'
      },
      roi: 'Opóźnienie w skalowaniu może kosztować Cię utratę 30% wzrostu rynku.',
      ctaText: 'Chcę szybko skalować'
    }
  ];

  return (
    <div>
      {painPoints.map((pain) => (
        <PainSection key={pain.id} {...pain} />
      ))}
    </div>
  );
} 