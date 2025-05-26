'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schemat walidacji dla klienta prywatnego
const privateClientSchema = z.object({
  type: z.literal('private'),
  firstName: z.string().min(2, 'Imię musi mieć minimum 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć minimum 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  budget: z.string().min(1, 'Wybierz budżet'),
  timeline: z.string().min(1, 'Wybierz termin realizacji'),
  currentSolution: z.string().optional(),
  painPoints: z.array(z.string()).min(1, 'Wybierz przynajmniej jeden problem'),
  message: z.string().min(10, 'Wiadomość musi mieć minimum 10 znaków'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Musisz zaakceptować regulamin'
  })
});

// Schemat walidacji dla klienta firmowego
const companyClientSchema = z.object({
  type: z.literal('company'),
  companyName: z.string().min(2, 'Nazwa firmy musi mieć minimum 2 znaki'),
  nip: z.string().length(10, 'NIP musi mieć 10 znaków'),
  industry: z.string().min(1, 'Wybierz branżę'),
  companySize: z.string().min(1, 'Wybierz wielkość firmy'),
  firstName: z.string().min(2, 'Imię musi mieć minimum 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć minimum 2 znaki'),
  position: z.string().min(2, 'Stanowisko musi mieć minimum 2 znaki'),
  decisionMaker: z.string().min(1, 'Wybierz rolę w procesie decyzyjnym'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  budget: z.string().min(1, 'Wybierz budżet'),
  timeline: z.string().min(1, 'Wybierz termin realizacji'),
  currentSolution: z.string().optional(),
  painPoints: z.array(z.string()).min(1, 'Wybierz przynajmniej jeden problem'),
  expectedROI: z.string().min(1, 'Wybierz oczekiwany ROI'),
  message: z.string().min(10, 'Wiadomość musi mieć minimum 10 znaków'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Musisz zaakceptować regulamin'
  })
});

// Połączony schemat walidacji
const formSchema = z.discriminatedUnion('type', [
  privateClientSchema,
  companyClientSchema
]);

type FormData = z.infer<typeof formSchema>;
type FormErrors = {
  companyName?: { message: string };
  nip?: { message: string };
  industry?: { message: string };
  companySize?: { message: string };
  position?: { message: string };
  decisionMaker?: { message: string };
  firstName?: { message: string };
  lastName?: { message: string };
  email?: { message: string };
  phone?: { message: string };
  budget?: { message: string };
  timeline?: { message: string };
  currentSolution?: { message: string };
  painPoints?: { message: string };
  expectedROI?: { message: string };
  message?: { message: string };
  acceptTerms?: { message: string };
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'private',
      acceptTerms: false,
      painPoints: []
    }
  });

  const clientType = watch('type');
  const painPoints = watch('painPoints') || [];
  const typedErrors = errors as FormErrors;

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    const currentPainPoints = painPoints || [];
    if (checked) {
      setValue('painPoints', [...currentPainPoints, painPoint]);
    } else {
      setValue('painPoints', currentPainPoints.filter(p => p !== painPoint));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Symulacja wysyłania formularza
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tutaj będzie prawdziwe API call do zapisania leada
      console.log('Form data:', data);

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    'Inne'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Dziękujemy za kontakt!</h3>
          <p>Twoja wiadomość została wysłana. Skontaktujemy się z Tobą najszybciej jak to możliwe.</p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-4 text-green-600 hover:text-green-800"
          >
            Wyślij kolejną wiadomość
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Typ klienta */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Typ klienta</h3>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="private"
                  {...register('type')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Klient prywatny</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="company"
                  {...register('type')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Firma</span>
              </label>
            </div>
          </div>

          {/* Informacje o firmie */}
          {clientType === 'company' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informacje o firmie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa firmy *
                  </label>
                  <input
                    type="text"
                    {...register('companyName')}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      typedErrors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {typedErrors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{typedErrors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIP *
                  </label>
                  <input
                    type="text"
                    {...register('nip')}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      typedErrors.nip ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {typedErrors.nip && (
                    <p className="mt-1 text-sm text-red-600">{typedErrors.nip.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branża *
                  </label>
                  <select
                    {...register('industry')}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      typedErrors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Wybierz branżę</option>
                    <option value="it">IT/Technologie</option>
                    <option value="finance">Finanse/Bankowość</option>
                    <option value="healthcare">Ochrona zdrowia</option>
                    <option value="retail">Handel detaliczny</option>
                    <option value="manufacturing">Produkcja</option>
                    <option value="education">Edukacja</option>
                    <option value="real-estate">Nieruchomości</option>
                    <option value="consulting">Konsulting</option>
                    <option value="other">Inna</option>
                  </select>
                  {typedErrors.industry && (
                    <p className="mt-1 text-sm text-red-600">{typedErrors.industry.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wielkość firmy *
                  </label>
                  <select
                    {...register('companySize')}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      typedErrors.companySize ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Wybierz wielkość</option>
                    <option value="1-10">1-10 pracowników</option>
                    <option value="11-50">11-50 pracowników</option>
                    <option value="51-200">51-200 pracowników</option>
                    <option value="201-500">201-500 pracowników</option>
                    <option value="500+">500+ pracowników</option>
                  </select>
                  {typedErrors.companySize && (
                    <p className="mt-1 text-sm text-red-600">{typedErrors.companySize.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dane kontaktowe */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dane kontaktowe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {typedErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwisko *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {typedErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.lastName.message}</p>
                )}
              </div>

              {clientType === 'company' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stanowisko *
                    </label>
                    <input
                      type="text"
                      {...register('position')}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        typedErrors.position ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {typedErrors.position && (
                      <p className="mt-1 text-sm text-red-600">{typedErrors.position.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rola w procesie decyzyjnym *
                    </label>
                    <select
                      {...register('decisionMaker')}
                      className={`w-full border rounded-lg px-3 py-2 ${
                        typedErrors.decisionMaker ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Wybierz rolę</option>
                      <option value="decision-maker">Podejmuję decyzje samodzielnie</option>
                      <option value="influencer">Wpływam na decyzje</option>
                      <option value="evaluator">Oceniam rozwiązania</option>
                      <option value="user">Będę użytkownikiem systemu</option>
                    </select>
                    {typedErrors.decisionMaker && (
                      <p className="mt-1 text-sm text-red-600">{typedErrors.decisionMaker.message}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {typedErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {typedErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Wymagania projektowe */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Wymagania projektowe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budżet *
                </label>
                <select
                  {...register('budget')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Wybierz budżet</option>
                  <option value="5000-15000">5 000 - 15 000 zł</option>
                  <option value="15000-30000">15 000 - 30 000 zł</option>
                  <option value="30000-50000">30 000 - 50 000 zł</option>
                  <option value="50000-100000">50 000 - 100 000 zł</option>
                  <option value="100000+">100 000+ zł</option>
                </select>
                {typedErrors.budget && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.budget.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termin realizacji *
                </label>
                <select
                  {...register('timeline')}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    typedErrors.timeline ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Wybierz termin</option>
                  <option value="asap">Jak najszybciej</option>
                  <option value="1-month">W ciągu miesiąca</option>
                  <option value="3-months">W ciągu 3 miesięcy</option>
                  <option value="6-months">W ciągu 6 miesięcy</option>
                  <option value="planning">Jestem w fazie planowania</option>
                </select>
                {typedErrors.timeline && (
                  <p className="mt-1 text-sm text-red-600">{typedErrors.timeline.message}</p>
                )}
              </div>

              {clientType === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oczekiwany ROI *
                  </label>
                  <select
                    {...register('expectedROI')}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      typedErrors.expectedROI ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Wybierz oczekiwany ROI</option>
                    <option value="6-months">Zwrot w 6 miesięcy</option>
                    <option value="12-months">Zwrot w 12 miesięcy</option>
                    <option value="24-months">Zwrot w 24 miesiące</option>
                    <option value="long-term">Inwestycja długoterminowa</option>
                  </select>
                  {typedErrors.expectedROI && (
                    <p className="mt-1 text-sm text-red-600">{typedErrors.expectedROI.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Obecne rozwiązanie
                </label>
                <input
                  type="text"
                  {...register('currentSolution')}
                  placeholder="Np. Excel, inny CRM, brak systemu"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Problemy do rozwiązania */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Główne problemy do rozwiązania *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {painPointOptions.map((painPoint) => (
                <label key={painPoint} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={painPoints.includes(painPoint)}
                    onChange={(e) => handlePainPointChange(painPoint, e.target.checked)}
                    className="form-checkbox text-blue-600"
                  />
                  <span className="ml-2 text-sm">{painPoint}</span>
                </label>
              ))}
            </div>
            {typedErrors.painPoints && (
              <p className="mt-2 text-sm text-red-600">{typedErrors.painPoints.message}</p>
            )}
          </div>

          {/* Wiadomość */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dodatkowe informacje</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opisz swoje potrzeby *
              </label>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Opisz szczegółowo swoje potrzeby, oczekiwania i cele..."
                className={`w-full border rounded-lg px-3 py-2 ${
                  typedErrors.message ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {typedErrors.message && (
                <p className="mt-1 text-sm text-red-600">{typedErrors.message.message}</p>
              )}
            </div>
          </div>

          {/* Regulamin */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">
                Akceptuję{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                  regulamin i politykę prywatności
                </a>
              </span>
            </label>
            {typedErrors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">{typedErrors.acceptTerms.message}</p>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {submitError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 