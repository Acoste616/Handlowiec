'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface QualificationData {
  // Informacje biznesowe
  industry: string;
  companySize: string;
  position: string;
  decisionMaker: string;
  
  // Budżet i timeline
  budget: string;
  timeline: string;
  expectedROI: string;
  
  // Obecna sytuacja
  currentSolution: string;
  painPoints: string[];
  teamSize: string;
  currentResults: string;
  
  // Oczekiwania
  mainGoals: string[];
  priorityAreas: string[];
  successMetrics: string;
  
  // Dodatkowe
  previousExperience: string;
  specificRequirements: string;
}

function KwalifikacjaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pobierz leadId z URL params
  const leadId = searchParams.get('leadId');
  
  const [formData, setFormData] = useState<QualificationData>({
    industry: '',
    companySize: '',
    position: '',
    decisionMaker: '',
    budget: '',
    timeline: '',
    expectedROI: '',
    currentSolution: '',
    painPoints: [],
    teamSize: '',
    currentResults: '',
    mainGoals: [],
    priorityAreas: [],
    successMetrics: '',
    previousExperience: '',
    specificRequirements: ''
  });

  useEffect(() => {
    if (!leadId) {
      // Jeśli nie ma leadId, przekieruj do strony kontakt
      router.push('/kontakt');
    }
  }, [leadId, router]);

  const industries = [
    { value: 'it', label: 'IT / Technologie' },
    { value: 'consulting', label: 'Konsulting' },
    { value: 'finance', label: 'Finanse / Bankowość' },
    { value: 'healthcare', label: 'Ochrona zdrowia' },
    { value: 'education', label: 'Edukacja' },
    { value: 'retail', label: 'Handel detaliczny' },
    { value: 'manufacturing', label: 'Produkcja' },
    { value: 'real-estate', label: 'Nieruchomości' },
    { value: 'legal', label: 'Prawnicze' },
    { value: 'marketing', label: 'Marketing / Reklama' },
    { value: 'other', label: 'Inne' }
  ];

  const companySizes = [
    { value: '1-10', label: '1-10 pracowników' },
    { value: '11-50', label: '11-50 pracowników' },
    { value: '51-200', label: '51-200 pracowników' },
    { value: '201-500', label: '201-500 pracowników' },
    { value: '500+', label: '500+ pracowników' }
  ];

  const budgetRanges = [
    { value: '5000-15000', label: '5 000 - 15 000 zł' },
    { value: '15000-30000', label: '15 000 - 30 000 zł' },
    { value: '30000-50000', label: '30 000 - 50 000 zł' },
    { value: '50000-100000', label: '50 000 - 100 000 zł' },
    { value: '100000+', label: 'Powyżej 100 000 zł' }
  ];

  const timelines = [
    { value: 'asap', label: 'Jak najszybciej' },
    { value: '1-month', label: 'W ciągu miesiąca' },
    { value: '3-months', label: 'W ciągu 3 miesięcy' },
    { value: '6-months', label: 'W ciągu 6 miesięcy' },
    { value: 'planning', label: 'Jestem w fazie planowania' }
  ];

  const painPointOptions = [
    'Brak systemu CRM',
    'Trudności w zarządzaniu leadami',
    'Słaba komunikacja z klientami',
    'Brak automatyzacji procesów',
    'Problemy z raportowaniem',
    'Niska konwersja leadów',
    'Długi czas odpowiedzi',
    'Brak integracji systemów',
    'Trudności w śledzeniu wyników',
    'Brak profesjonalnego zespołu sprzedażowego',
    'Wysokie koszty pozyskania klientów',
    'Problemy z follow-up'
  ];

  const mainGoalOptions = [
    'Zwiększenie liczby leadów',
    'Poprawa konwersji',
    'Automatyzacja procesów',
    'Lepsze zarządzanie klientami',
    'Zwiększenie przychodów',
    'Skrócenie cyklu sprzedaży',
    'Poprawa jakości obsługi',
    'Budowa profesjonalnego zespołu',
    'Optymalizacja kosztów',
    'Lepsze raportowanie'
  ];

  const handleInputChange = (field: keyof QualificationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field: 'painPoints' | 'mainGoals' | 'priorityAreas', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.industry && formData.companySize && formData.position && formData.decisionMaker);
      case 2:
        return !!(formData.budget && formData.timeline);
      case 3:
        return !!(formData.currentSolution && formData.painPoints.length > 0);
      case 4:
        return !!(formData.mainGoals.length > 0 && formData.successMetrics);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setError(null);
    } else {
      setError('Proszę wypełnić wszystkie wymagane pola');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!leadId) {
      setError('Brak identyfikatora leada');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads/qualify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          qualificationData: formData
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/thank-you?qualified=true');
      } else {
        setError(result.message || 'Wystąpił błąd podczas zapisywania danych');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informacje o firmie</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branża *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Wybierz branżę</option>
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wielkość firmy *
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Wybierz wielkość</option>
                {companySizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twoje stanowisko *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="np. Dyrektor sprzedaży, CEO, Właściciel"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rola w procesie decyzyjnym *
              </label>
              <select
                value={formData.decisionMaker}
                onChange={(e) => handleInputChange('decisionMaker', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Wybierz rolę</option>
                <option value="decision-maker">Podejmuję ostateczne decyzje</option>
                <option value="influencer">Mam duży wpływ na decyzje</option>
                <option value="evaluator">Oceniam rozwiązania</option>
                <option value="user">Będę użytkownikiem końcowym</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budżet i timeline</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budżet miesięczny *
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Wybierz zakres budżetu</option>
                {budgetRanges.map(budget => (
                  <option key={budget.value} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kiedy chcesz rozpocząć? *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Wybierz timeline</option>
                {timelines.map(timeline => (
                  <option key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oczekiwany ROI
              </label>
              <select
                value={formData.expectedROI}
                onChange={(e) => handleInputChange('expectedROI', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Wybierz oczekiwany ROI</option>
                <option value="3-months">Zwrot w 3 miesiące</option>
                <option value="6-months">Zwrot w 6 miesięcy</option>
                <option value="12-months">Zwrot w 12 miesięcy</option>
                <option value="18-months">Zwrot w 18 miesięcy</option>
                <option value="long-term">Długoterminowa inwestycja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wielkość zespołu sprzedażowego
              </label>
              <input
                type="text"
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="np. 3 osoby, brak zespołu, tylko ja"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Obecna sytuacja</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obecne rozwiązanie *
              </label>
              <textarea
                value={formData.currentSolution}
                onChange={(e) => handleInputChange('currentSolution', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="Opisz jak obecnie zarządzasz sprzedażą (Excel, CRM, notatnik, etc.)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Główne problemy * (wybierz wszystkie, które dotyczą Twojej firmy)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {painPointOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.painPoints.includes(option)}
                      onChange={() => handleMultiSelect('painPoints', option)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obecne wyniki sprzedażowe
              </label>
              <textarea
                value={formData.currentResults}
                onChange={(e) => handleInputChange('currentResults', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="np. 10 leadów miesięcznie, konwersja 5%, średnia wartość transakcji 5000 zł"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cele i oczekiwania</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Główne cele * (wybierz wszystkie, które są dla Ciebie ważne)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mainGoalOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.mainGoals.includes(option)}
                      onChange={() => handleMultiSelect('mainGoals', option)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jak będziesz mierzył sukces? *
              </label>
              <textarea
                value={formData.successMetrics}
                onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="np. zwiększenie leadów o 50%, poprawa konwersji do 15%, wzrost przychodów o 100k zł miesięcznie"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poprzednie doświadczenia z outsourcingiem sprzedaży
              </label>
              <textarea
                value={formData.previousExperience}
                onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
                placeholder="Opisz czy korzystałeś wcześniej z podobnych usług i jakie były efekty"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dodatkowe informacje</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specjalne wymagania lub oczekiwania
              </label>
              <textarea
                value={formData.specificRequirements}
                onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={4}
                placeholder="Opisz wszelkie specjalne wymagania, oczekiwania co do komunikacji, raportowania, etc."
              />
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🎉 Gratulacje! Prawie skończyliśmy
              </h3>
              <p className="text-blue-700 mb-4">
                Dzięki tym informacjom będziemy mogli przygotować dla Ciebie spersonalizowaną propozycję współpracy.
              </p>
              <p className="text-blue-700 text-sm">
                Po kliknięciu "Zakończ" nasz ekspert skontaktuje się z Tobą w ciągu 24 godzin z konkretnym planem działania.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!leadId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Przekierowywanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">BezHandlowca.pl</h1>
            </div>
            <div className="text-sm text-gray-500">
              Krok {currentStep} z 5
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Postęp kwalifikacji</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStep()}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wstecz
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Dalej
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Zakończ kwalifikację
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KwalifikacjaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie formularza kwalifikacyjnego...</p>
        </div>
      </div>
    }>
      <KwalifikacjaContent />
    </Suspense>
  );
} 