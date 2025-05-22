'use client';

import { useState, useEffect } from 'react';

interface TestimonialProps {
  name: string;
  position: string;
  company: string;
  logo: string;
  quote: string;
  result: string;
  avatar: string;
}

export default function SocialProofCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials: TestimonialProps[] = [
    {
      name: "Michał Kowalski",
      position: "CEO",
      company: "TechFlow Solutions",
      logo: "🏢",
      quote: "Przez 2 lata walczyłem z rotacją handlowców. BezHandlowca.pl rozwiązało problem w 3 miesiące. Teraz mam stabilną sprzedaż bez ryzyka.",
      result: "+300% leadów w 90 dni",
      avatar: "👨‍💼"
    },
    {
      name: "Anna Nowak",
      position: "Dyrektor Sprzedaży",
      company: "ProBiznes Sp. z o.o.",
      logo: "🏭",
      quote: "Zatrudnienie handlowca kosztowało nas 200k rocznie. Z BezHandlowca.pl płacimy tylko za efekty i mamy lepsze wyniki.",
      result: "60% redukcja kosztów sprzedaży",
      avatar: "👩‍💼"
    },
    {
      name: "Tomasz Wiśniewski",
      position: "Założyciel",
      company: "DigitalMart",
      logo: "💻",
      quote: "Nie musiałem już tracić miesięcy na rekrutację i szkolenia. Zespół BezHandlowca.pl od razu wiedział, co robić.",
      result: "+150% konwersja w lejku sprzedaży",
      avatar: "👨‍💻"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('dowod');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="dowod" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Co mówią nasi klienci?
          </h2>
          <p className="text-xl text-gray-600">
            Zobacz, jak inni CEO rozwiązali problemy z handlowcami
          </p>
        </div>

        <div className={`relative max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Testimonial Cards */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-gray-50 p-8 lg:p-12 rounded-2xl">
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                      
                      {/* Quote */}
                      <div className="lg:col-span-2">
                        <div className="text-6xl text-secondary-500 mb-4">"</div>
                        <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 font-medium">
                          {testimonial.quote}
                        </blockquote>
                        
                        <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded">
                          <p className="text-lg font-bold text-secondary-600">
                            {testimonial.result}
                          </p>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="text-center lg:text-left">
                        <div className="mb-4">
                          <div className="text-6xl mb-4">{testimonial.avatar}</div>
                          <div className="text-4xl mb-4">{testimonial.logo}</div>
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 mb-1">
                            {testimonial.position}
                          </p>
                          <p className="text-gray-500 font-medium">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-secondary-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => goToSlide(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => goToSlide((currentIndex + 1) % testimonials.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-500 mb-2">100+</div>
            <p className="text-gray-600">Zadowolonych firm</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-500 mb-2">250%</div>
            <p className="text-gray-600">Średni wzrost leadów</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-500 mb-2">3 mies.</div>
            <p className="text-gray-600">Do pierwszych efektów</p>
          </div>
        </div>
      </div>
    </section>
  );
} 