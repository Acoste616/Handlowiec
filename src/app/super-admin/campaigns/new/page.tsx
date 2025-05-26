'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CampaignData {
  name: string;
  platform: 'google_ads' | 'facebook' | 'linkedin' | 'tiktok' | 'email' | '';
  objective: 'lead_generation' | 'brand_awareness' | 'website_traffic' | 'conversions' | '';
  budget: number;
  duration: number;
  targetAudience: {
    demographics: {
      ageMin: number;
      ageMax: number;
      gender: 'all' | 'male' | 'female';
      location: string[];
    };
    interests: string[];
    behaviors: string[];
    jobTitles: string[];
    companySize: string[];
    industry: string[];
  };
  adContent: {
    headline: string;
    description: string;
    callToAction: string;
    keywords: string[];
  };
  landingPage: string;
  trackingPixels: string[];
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    platform: '',
    objective: '',
    budget: 5000,
    duration: 30,
    targetAudience: {
      demographics: {
        ageMin: 25,
        ageMax: 55,
        gender: 'all',
        location: ['Polska']
      },
      interests: [],
      behaviors: [],
      jobTitles: [],
      companySize: [],
      industry: []
    },
    adContent: {
      headline: '',
      description: '',
      callToAction: '',
      keywords: []
    },
    landingPage: '',
    trackingPixels: []
  });

  const steps = [
    { id: 1, name: 'Podstawy', description: 'Platforma i cel kampanii' },
    { id: 2, name: 'Budżet', description: 'Budżet i czas trwania' },
    { id: 3, name: 'Grupa docelowa', description: 'Targeting i demografia' },
    { id: 4, name: 'Treści AI', description: 'Generowanie treści przez AI' },
    { id: 5, name: 'Podsumowanie', description: 'Przegląd i uruchomienie' }
  ];

  const platforms = [
    { id: 'google_ads', name: 'Google Ads', icon: '🔍', description: 'Reklamy w wyszukiwarce i sieci reklamowej' },
    { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Reklamy w Facebook i Instagram' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Reklamy dla profesjonalistów B2B' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'Reklamy wideo dla młodszej grupy' },
    { id: 'email', name: 'Email Marketing', icon: '📧', description: 'Kampanie emailowe do bazy' }
  ];

  const objectives = [
    { id: 'lead_generation', name: 'Generowanie leadów', description: 'Pozyskiwanie nowych potencjalnych klientów' },
    { id: 'brand_awareness', name: 'Świadomość marki', description: 'Zwiększanie rozpoznawalności marki' },
    { id: 'website_traffic', name: 'Ruch na stronę', description: 'Kierowanie użytkowników na stronę internetową' },
    { id: 'conversions', name: 'Konwersje', description: 'Zachęcanie do konkretnych działań' }
  ];

  const industries = [
    'Technologie IT', 'E-commerce', 'Finanse', 'Nieruchomości', 'Edukacja',
    'Zdrowie', 'Produkcja', 'Usługi', 'Handel detaliczny', 'Logistyka'
  ];

  const companySizes = [
    '1-10 pracowników', '11-50 pracowników', '51-200 pracowników',
    '201-1000 pracowników', '1000+ pracowników'
  ];

  const jobTitles = [
    'CEO', 'CTO', 'CMO', 'Dyrektor sprzedaży', 'Kierownik IT',
    'Specjalista ds. marketingu', 'Właściciel firmy', 'Menedżer projektu'
  ];

  const generateAIContent = async () => {
    setAiGenerating(true);
    try {
      // Symulacja generowania treści przez AI
      await new Promise(resolve => setTimeout(resolve, 3000));

      const aiContent = {
        headline: `Zwiększ sprzedaż o 300% z naszym systemem CRM`,
        description: `Odkryj jak automatyzacja sprzedaży może transformować Twój biznes. Sprawdzone rozwiązania dla firm ${campaignData.targetAudience.industry.join(', ').toLowerCase()}. Bezpłatna konsultacja i demo systemu.`,
        callToAction: 'Umów bezpłatną konsultację',
        keywords: [
          'system CRM',
          'automatyzacja sprzedaży',
          'zwiększenie sprzedaży',
          'zarządzanie klientami',
          'lead generation',
          'bezpłatna konsultacja'
        ]
      };

      setCampaignData(prev => ({
        ...prev,
        adContent: aiContent
      }));
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Symulacja tworzenia kampanii
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Przekierowanie do listy kampanii
      router.push('/super-admin/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.platform && campaignData.objective;
      case 2:
        return campaignData.budget > 0 && campaignData.duration > 0;
      case 3:
        return campaignData.targetAudience.industry.length > 0;
      case 4:
        return campaignData.adContent.headline && campaignData.adContent.description;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-red-600">🤖 Kreator Kampanii AI</h1>
              <p className="text-sm text-gray-500">
                Utwórz nową kampanię pozyskiwania leadów
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Powrót
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-red-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Step 1: Podstawy */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Podstawowe informacje</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa kampanii
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  placeholder="np. CRM dla firm IT - Q1 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Wybierz platformę reklamową
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      onClick={() => setCampaignData(prev => ({ ...prev, platform: platform.id as any }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        campaignData.platform === platform.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{platform.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{platform.name}</h3>
                          <p className="text-sm text-gray-600">{platform.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Cel kampanii
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {objectives.map((objective) => (
                    <div
                      key={objective.id}
                      onClick={() => setCampaignData(prev => ({ ...prev, objective: objective.id as any }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        campaignData.objective === objective.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">{objective.name}</h3>
                      <p className="text-sm text-gray-600">{objective.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budżet */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Budżet i czas trwania</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budżet kampanii (PLN)
                  </label>
                  <input
                    type="number"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    min="100"
                    step="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimalny budżet: 100 PLN
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Czas trwania (dni)
                  </label>
                  <input
                    type="number"
                    value={campaignData.duration}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                    min="1"
                    max="365"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maksymalnie 365 dni
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Szacowane wyniki</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">Dzienny budżet</p>
                    <p className="font-medium text-blue-900">{Math.round(campaignData.budget / campaignData.duration)} PLN</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Szacowane leady</p>
                    <p className="font-medium text-blue-900">{Math.round(campaignData.budget / 300)}</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Koszt za lead</p>
                    <p className="font-medium text-blue-900">~300 PLN</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Grupa docelowa */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Grupa docelowa</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wiek (lata)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={campaignData.targetAudience.demographics.ageMin}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          demographics: {
                            ...prev.targetAudience.demographics,
                            ageMin: parseInt(e.target.value) || 18
                          }
                        }
                      }))}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-black"
                      min="18"
                      max="65"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={campaignData.targetAudience.demographics.ageMax}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        targetAudience: {
                          ...prev.targetAudience,
                          demographics: {
                            ...prev.targetAudience.demographics,
                            ageMax: parseInt(e.target.value) || 65
                          }
                        }
                      }))}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-black"
                      min="18"
                      max="65"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Płeć
                  </label>
                  <select
                    value={campaignData.targetAudience.demographics.gender}
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      targetAudience: {
                        ...prev.targetAudience,
                        demographics: {
                          ...prev.targetAudience.demographics,
                          gender: e.target.value as any
                        }
                      }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="male">Mężczyźni</option>
                    <option value="female">Kobiety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branże (wybierz przynajmniej jedną)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {industries.map((industry) => (
                    <label key={industry} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignData.targetAudience.industry.includes(industry)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                industry: [...prev.targetAudience.industry, industry]
                              }
                            }));
                          } else {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                industry: prev.targetAudience.industry.filter(i => i !== industry)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wielkość firmy
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {companySizes.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignData.targetAudience.companySize.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                companySize: [...prev.targetAudience.companySize, size]
                              }
                            }));
                          } else {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                companySize: prev.targetAudience.companySize.filter(s => s !== size)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stanowiska
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {jobTitles.map((title) => (
                    <label key={title} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignData.targetAudience.jobTitles.includes(title)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                jobTitles: [...prev.targetAudience.jobTitles, title]
                              }
                            }));
                          } else {
                            setCampaignData(prev => ({
                              ...prev,
                              targetAudience: {
                                ...prev.targetAudience,
                                jobTitles: prev.targetAudience.jobTitles.filter(t => t !== title)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Treści AI */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Treści reklamowe</h2>
                <button
                  onClick={generateAIContent}
                  disabled={aiGenerating}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {aiGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generowanie AI...
                    </>
                  ) : (
                    <>
                      🤖 Wygeneruj treści AI
                    </>
                  )}
                </button>
              </div>

              {aiGenerating && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                    <div>
                      <p className="font-medium text-purple-900">AI analizuje Twoją grupę docelową...</p>
                      <p className="text-sm text-purple-700">Generowanie spersonalizowanych treści reklamowych</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nagłówek reklamy
                </label>
                <input
                  type="text"
                  value={campaignData.adContent.headline}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    adContent: { ...prev.adContent, headline: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  placeholder="Wprowadź przyciągający nagłówek..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis reklamy
                </label>
                <textarea
                  value={campaignData.adContent.description}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    adContent: { ...prev.adContent, description: e.target.value }
                  }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  placeholder="Opisz korzyści i zachęć do działania..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={campaignData.adContent.callToAction}
                  onChange={(e) => setCampaignData(prev => ({
                    ...prev,
                    adContent: { ...prev.adContent, callToAction: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  placeholder="np. Umów bezpłatną konsultację"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Słowa kluczowe
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {campaignData.adContent.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        onClick={() => setCampaignData(prev => ({
                          ...prev,
                          adContent: {
                            ...prev.adContent,
                            keywords: prev.adContent.keywords.filter((_, i) => i !== index)
                          }
                        }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Dodaj słowo kluczowe i naciśnij Enter"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const keyword = e.currentTarget.value.trim();
                      if (keyword && !campaignData.adContent.keywords.includes(keyword)) {
                        setCampaignData(prev => ({
                          ...prev,
                          adContent: {
                            ...prev.adContent,
                            keywords: [...prev.adContent.keywords, keyword]
                          }
                        }));
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>

              {campaignData.adContent.headline && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Podgląd reklamy</h3>
                  <div className="border border-gray-200 bg-white p-4 rounded">
                    <h4 className="font-semibold text-blue-600 mb-1">{campaignData.adContent.headline}</h4>
                    <p className="text-sm text-gray-700 mb-2">{campaignData.adContent.description}</p>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      {campaignData.adContent.callToAction || 'Dowiedz się więcej'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Podsumowanie */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Podsumowanie kampanii</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Podstawowe informacje</h3>
                    <p className="text-sm text-gray-600">Nazwa: {campaignData.name}</p>
                    <p className="text-sm text-gray-600">Platforma: {platforms.find(p => p.id === campaignData.platform)?.name}</p>
                    <p className="text-sm text-gray-600">Cel: {objectives.find(o => o.id === campaignData.objective)?.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Budżet</h3>
                    <p className="text-sm text-gray-600">Łączny budżet: {campaignData.budget.toLocaleString()} PLN</p>
                    <p className="text-sm text-gray-600">Czas trwania: {campaignData.duration} dni</p>
                    <p className="text-sm text-gray-600">Dzienny budżet: {Math.round(campaignData.budget / campaignData.duration)} PLN</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Grupa docelowa</h3>
                    <p className="text-sm text-gray-600">
                      Wiek: {campaignData.targetAudience.demographics.ageMin}-{campaignData.targetAudience.demographics.ageMax} lat
                    </p>
                    <p className="text-sm text-gray-600">Branże: {campaignData.targetAudience.industry.join(', ')}</p>
                    {campaignData.targetAudience.companySize.length > 0 && (
                      <p className="text-sm text-gray-600">Wielkość firm: {campaignData.targetAudience.companySize.join(', ')}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Treści</h3>
                    <p className="text-sm text-gray-600">Nagłówek: {campaignData.adContent.headline}</p>
                    <p className="text-sm text-gray-600">CTA: {campaignData.adContent.callToAction}</p>
                    <p className="text-sm text-gray-600">Słowa kluczowe: {campaignData.adContent.keywords.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">🎯 Szacowane wyniki</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700">Przewidywane leady</p>
                    <p className="font-medium text-green-900">{Math.round(campaignData.budget / 300)}</p>
                  </div>
                  <div>
                    <p className="text-green-700">Koszt za lead</p>
                    <p className="font-medium text-green-900">~300 PLN</p>
                  </div>
                  <div>
                    <p className="text-green-700">ROI</p>
                    <p className="font-medium text-green-900">250-400%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Poprzedni krok
            </button>

            <div className="flex space-x-3">
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Następny krok →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !isStepValid()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tworzenie kampanii...
                    </>
                  ) : (
                    '🚀 Uruchom kampanię'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 