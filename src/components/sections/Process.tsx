export function Process() {
  const steps = [
    {
      number: '01',
      title: 'Analiza potrzeb',
      description: 'Poznajemy Twoją firmę, branżę i cele sprzedażowe. Określamy profil idealnego klienta i strategię.',
      icon: '🎯',
    },
    {
      number: '02',
      title: 'Dedykowany zespół',
      description: 'Dobieramy doświadczonych handlowców B2B, którzy znają Twoją branżę i rozumieją potrzeby klientów.',
      icon: '👥',
    },
    {
      number: '03',
      title: 'Onboarding',
      description: 'Szkolimy zespół z Twoich produktów i procesów. Ustalamy KPI i harmonogram działań.',
      icon: '📚',
    },
    {
      number: '04',
      title: 'Generowanie leadów',
      description: 'Systematycznie wypełniamy lejek sprzedażowy. Każdy lead jest weryfikowany i kwalifikowany.',
      icon: '📈',
    },
    {
      number: '05',
      title: 'Zarządzanie pipeline',
      description: 'Aktywnie prowadzimy rozmowy i negocjacje. Dbamy o relacje z klientami na każdym etapie.',
      icon: '🤝',
    },
    {
      number: '06',
      title: 'Raporty i optymalizacja',
      description: 'Regularnie raportujemy wyniki i optymalizujemy proces sprzedażowy. Skupiamy się na ROI.',
      icon: '📊',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Jak to działa?
        </h2>
        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
          Prosty i przejrzysty proces, który przynosi realne wyniki
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white text-xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-primary-100">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-primary-100 mb-8">
          Średni czas od pierwszego kontaktu do zamknięcia kontraktu: 45 dni
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-900 bg-white hover:bg-primary-50"
        >
          Rozpocznij współpracę
        </a>
      </div>
    </div>
  );
} 