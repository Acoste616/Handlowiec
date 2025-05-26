'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewLeadForm {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  assignedTo: string;
  estimatedValue: number | null;
}

export default function NewLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NewLeadForm>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    source: 'manual',
    priority: 'medium',
    status: 'new',
    assignedTo: '',
    estimatedValue: null
  });

  const sources = [
    { value: 'manual', label: 'Ręczne dodanie' },
    { value: 'website', label: 'Strona internetowa' },
    { value: 'referral', label: 'Polecenie' },
    { value: 'cold_call', label: 'Cold call' },
    { value: 'event', label: 'Wydarzenie' },
    { value: 'social_media', label: 'Media społecznościowe' },
    { value: 'email_campaign', label: 'Kampania email' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'other', label: 'Inne' }
  ];

  const agents = [
    { value: '', label: 'Nie przypisany' },
    { value: 'admin@bezhandlowca.pl', label: 'Administrator' },
    { value: 'bartek@bezhandlowca.pl', label: 'Bartek Nowak' },
    { value: 'marta@bezhandlowca.pl', label: 'Marta Kowalska' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedValue' ? (value ? Number(value) : null) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim()) {
      setError('Imię jest wymagane');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email jest wymagany');
      return;
    }

    if (!formData.company.trim()) {
      setError('Nazwa firmy jest wymagana');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Zapisz lead przez API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          source: 'super-admin',
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Przekierowanie po zapisaniu
        router.push('/super-admin/leads');
      } else {
        setError(result.message || 'Błąd podczas zapisywania leada');
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      setError('Błąd podczas zapisywania leada');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/super-admin/leads"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Wróć
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">➕ Nowy lead</h1>
                <p className="text-sm text-gray-500">
                  Dodaj nowy lead do systemu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Podstawowe informacje</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Jan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Firma *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="TechCorp Sp. z o.o."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="jan@techcorp.pl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="+48 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Źródło
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {sources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wiadomość/Notatki
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Dodatkowe informacje o leadzie..."
              />
            </div>
          </div>

          {/* Lead Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Zarządzanie leadem</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="new">Nowy</option>
                  <option value="contacted">Skontaktowany</option>
                  <option value="qualified">Zakwalifikowany</option>
                  <option value="proposal">Oferta</option>
                  <option value="closed">Zamknięty</option>
                  <option value="lost">Stracony</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorytet
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="low">Niski</option>
                  <option value="medium">Średni</option>
                  <option value="high">Wysoki</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Przypisany do
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {agents.map(agent => (
                    <option key={agent.value} value={agent.value}>
                      {agent.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wartość szacunkowa (zł)
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="50000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/super-admin/leads"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 