'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewLeadForm {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  status: 'new' | 'contacted' | 'qualified';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'referral' | 'cold_call' | 'event' | 'linkedin' | 'google_ads' | 'facebook' | 'other';
  estimatedValue: string;
  notes: string;
  nextAction: string;
  nextActionDate: string;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentTag, setCurrentTag] = useState('');
  
  const [formData, setFormData] = useState<NewLeadForm>({
    firstName: '',
    lastName: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    companySize: '',
    status: 'new',
    priority: 'medium',
    source: 'website',
    estimatedValue: '',
    notes: '',
    nextAction: '',
    nextActionDate: '',
    tags: []
  });

  const industryOptions = [
    'IT/Software',
    'E-commerce',
    'Finanse/Bankowość',
    'Produkcja',
    'Handel',
    'Usługi',
    'Edukacja',
    'Zdrowie',
    'Nieruchomości',
    'Transport/Logistyka',
    'Media/Marketing',
    'Inne'
  ];

  const companySizeOptions = [
    '1-10 pracowników',
    '11-50 pracowników',
    '51-200 pracowników',
    '201-500 pracowników',
    '500+ pracowników'
  ];

  const sourceOptions = [
    { value: 'website', label: 'Strona internetowa' },
    { value: 'referral', label: 'Polecenie' },
    { value: 'cold_call', label: 'Cold call' },
    { value: 'event', label: 'Wydarzenie/Konferencja' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook', label: 'Facebook/Meta' },
    { value: 'other', label: 'Inne' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Wymagane pola
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Nazwa firmy jest wymagana';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    }

    // Walidacja wartości szacunkowej
    if (formData.estimatedValue && isNaN(Number(formData.estimatedValue))) {
      newErrors.estimatedValue = 'Wartość musi być liczbą';
    }

    // Walidacja daty następnej akcji
    if (formData.nextActionDate && new Date(formData.nextActionDate) < new Date()) {
      newErrors.nextActionDate = 'Data następnej akcji nie może być w przeszłości';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof NewLeadForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Usuń błąd dla tego pola jeśli istnieje
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Przygotowanie danych do wysłania
      const leadData = {
        ...formData,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined
      };

      // Wywołanie API
      const response = await fetch('/api/agent/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-ID': 'current-agent-id' // W produkcji pobrane z kontekstu użytkownika
        },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.details) {
          // Błędy walidacji z serwera
          const serverErrors: FormErrors = {};
          result.details.forEach((error: string) => {
            if (error.includes('Imię')) serverErrors.firstName = error;
            else if (error.includes('Nazwisko')) serverErrors.lastName = error;
            else if (error.includes('Email')) serverErrors.email = error;
            else if (error.includes('Telefon')) serverErrors.phone = error;
            else if (error.includes('firma')) serverErrors.company = error;
            else if (error.includes('Wartość')) serverErrors.estimatedValue = error;
            else if (error.includes('Data')) serverErrors.nextActionDate = error;
            else serverErrors.submit = error;
          });
          setErrors(serverErrors);
          return;
        } else if (response.status === 409) {
          // Lead już istnieje
          setErrors({ 
            email: 'Lead z tym adresem email już istnieje w systemie',
            submit: result.error 
          });
          return;
        } else {
          throw new Error(result.error || 'Wystąpił błąd podczas dodawania leada');
        }
      }

      console.log('Lead dodany pomyślnie:', result.data);

      // Przekierowanie po sukcesie z komunikatem
      router.push('/agent/leads?success=lead-created&leadId=' + result.data.id);
      
    } catch (error) {
      console.error('Błąd podczas dodawania leada:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Wystąpił błąd podczas dodawania leada. Spróbuj ponownie.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/agent/leads"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">➕ Nowy lead</h1>
                <p className="text-sm text-gray-500">
                  Dodaj nowy kontakt do swojej bazy leadów
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/agent/leads"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </Link>
              <button
                type="submit"
                form="new-lead-form"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Dodawanie...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Zapisz lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form id="new-lead-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Dane osobowe */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">👤 Dane osobowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jan"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Kowalski"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="jan.kowalski@firma.pl"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+48 123 456 789"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stanowisko
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CEO, CTO, Dyrektor IT..."
                />
              </div>
            </div>
          </div>

          {/* Dane firmy */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🏢 Dane firmy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa firmy *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.company ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="TechCorp Sp. z o.o."
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strona internetowa
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://firma.pl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branża
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Wybierz branżę</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wielkość firmy
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Wybierz wielkość</option>
                  {companySizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Szczegóły leada */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Szczegóły leada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="new">Nowy</option>
                  <option value="contacted">Skontaktowany</option>
                  <option value="qualified">Zakwalifikowany</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorytet
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Źródło
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sourceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wartość szacunkowa (zł)
                </label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.estimatedValue ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                  min="0"
                />
                {errors.estimatedValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedValue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Następne kroki */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Następne kroki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Następna akcja
                </label>
                <input
                  type="text"
                  value={formData.nextAction}
                  onChange={(e) => handleInputChange('nextAction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Telefon, email, spotkanie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data następnej akcji
                </label>
                <input
                  type="datetime-local"
                  value={formData.nextActionDate}
                  onChange={(e) => handleInputChange('nextActionDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.nextActionDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.nextActionDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.nextActionDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notatki i tagi */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📝 Dodatkowe informacje</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notatki
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dodatkowe informacje o leadzie, potrzebach, preferencjach..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagi
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dodaj tag i naciśnij Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Dodaj
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Podsumowanie */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Podsumowanie</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Lead:</strong> {formData.firstName} {formData.lastName} ({formData.company})</p>
              <p><strong>Kontakt:</strong> {formData.email} | {formData.phone}</p>
              <p><strong>Status:</strong> {formData.status} | <strong>Priorytet:</strong> {formData.priority}</p>
              {formData.estimatedValue && (
                <p><strong>Wartość szacunkowa:</strong> {Number(formData.estimatedValue).toLocaleString()} zł</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 