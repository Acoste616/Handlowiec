export function Benefits() {
  const benefits = [
    {
      title: 'Zero rotacji',
      description: 'Stały zespół handlowców, którzy znają Twoją firmę i branżę. Brak kosztów rekrutacji i onboardingu.',
      icon: '👥',
    },
    {
      title: 'Pełny lejek',
      description: 'Systematyczne generowanie leadów i zarządzanie pipeline. Przewidywalny przepływ nowych klientów.',
      icon: '📈',
    },
    {
      title: 'Skalowalność',
      description: 'Zwiększaj lub zmniejszaj zespół sprzedażowy w zależności od potrzeb. Płać tylko za wyniki.',
      icon: '⚖️',
    },
    {
      title: 'Profesjonalizm',
      description: 'Doświadczeni handlowcy B2B, regularne raporty i transparentna komunikacja.',
      icon: '🎯',
    },
    {
      title: 'Oszczędność',
      description: 'Brak kosztów ZUS, PPK i benefitów. Optymalne wykorzystanie budżetu sprzedażowego.',
      icon: '💰',
    },
    {
      title: 'Wsparcie',
      description: 'Dedykowany opiekun klienta i wsparcie techniczne. Szybkie reagowanie na potrzeby.',
      icon: '🤝',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Dlaczego warto z nami współpracować?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Profesjonalny outsourcing sprzedaży B2B to więcej niż usługa - to partnerstwo na rzecz Twojego sukcesu
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="relative bg-white p-8 rounded-2xl shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {benefit.title}
            </h3>
            <p className="text-gray-600">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 