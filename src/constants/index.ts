// Polish language content based on the PRD requirements
export const CONTENT = {
  hero: {
    headline: "Zatrudniasz – szkolisz – tracisz?",
    subheadline: "Zatrzymaj rotację i zamknij więcej kontraktów bez etatów.",
    description: "Profesjonalny outsourcing sprzedaży B2B dla polskich MŚP. Wypełniamy Twój lejek jakościowymi leadami i budujemy przewidywalną sprzedaż.",
    cta: "Umów 15-minutową rozmowę",
    ctaSecondary: "Zobacz jak to działa",
  },
  
  benefits: [
    {
      title: "Lejek pełen jakościowych leadów",
      description: "Koniec \"pustych list\" od agencji. Otrzymujesz weryfikowane kontakty do firm z Twojego ICP.",
      icon: "target",
    },
    {
      title: "Proces, nie wymówki",
      description: "KPI w dashboardzie, standardy follow-up, przejrzysty pipeline sprzedażowy.",
      icon: "chart",
    },
    {
      title: "Zero kosztów ZUS & PPK",
      description: "Płacisz tylko za wyniki. Brak stałych kosztów etatowego handlowca.",
      icon: "money",
    },
  ],
  
  socialProof: {
    title: "Zaufali nam przedsiębiorcy z całej Polski",
    testimonial: "W 90 dni wypełniliśmy lejek spółki SaaS 123 leadami ICP, co dało 7 nowych kontraktów – 0 rotacji handlowców.",
    author: "Przykładowy klient",
    companies: ["Company 1", "Company 2", "Company 3", "Company 4"],
  },
  
  process: {
    title: "Jak to działa? Proces Sales-Shelter™",
    description: "Handlowcy sprzedają, bo mają pełny lejek, a Ty śpisz spokojnie.",
    steps: [
      {
        title: "Audyt lejka",
        description: "Analizujemy Twój obecny proces sprzedaży i identyfikujemy wąskie gardła.",
      },
      {
        title: "System leadów \"pod klucz\"",
        description: "Budujemy dedykowane listy prospects i sekwencje outreach.",
      },
      {
        title: "Coaching handlowców",
        description: "Cotygodniowe wsparcie Twojego zespołu z playbook follow-upów.",
      },
    ],
  },
  
  painPoints: [
    {
      title: "20-30% rotacji = utrata nawet 6 msc. przychodu z jednego etatu",
      description: "Każda wymiana handlowca kosztuje Cię miesiące budowania relacji od nowa.",
    },
    {
      title: "Pusty lejek = stres właściciela",
      description: "Nie wiesz skąd przyjdą kolejni klienci. Żyjesz w niepewności.",
    },
    {
      title: "Koszt etatu vs wyniki",
      description: "Płacisz pensję + ZUS + PPK, a kontrakt podpisuje co trzeci miesiąc.",
    },
  ],
  
  faq: [
    {
      question: "Czy przejmiecie moich klientów?",
      answer: "Nie, działamy tylko na nowych leadach. Twoja baza klientów pozostaje w Twoich rękach.",
    },
    {
      question: "Jak szybko zobaczę wyniki?",
      answer: "Pierwsze kwalifikowane spotkania w ciągu 30 dni od startu współpracy.",
    },
    {
      question: "Ile to kosztuje?",
      answer: "Setup + success fee. Płacisz, gdy podpisujesz umowę. Bez ukrytych kosztów.",
    },
    {
      question: "Czy będę mieć kontrolę nad procesem?",
      answer: "Tak, otrzymasz pełny dostęp do dashboardu z KPI i raportami w czasie rzeczywistym.",
    },
    {
      question: "Jak wyglądają gwarancje?",
      answer: "Jeśli w pierwszych 60 dniach nie wygenerujemy kwalifikowanych leadów, zwracamy pieniądze.",
    },
  ],
  
  cta: {
    title: "Gotowy na przewidywalną sprzedaż?",
    subtitle: "Dołącz do przedsiębiorców, którzy postawili na profesjonalny outsourcing.",
    button: "Umów bezpłatną konsultację",
    guarantee: "15-minutowa rozmowa bez zobowiązań",
  },
  
  form: {
    title: "Umów bezpłatną konsultację",
    subtitle: "Opowiedz o swoim biznesie, a pokażemy jak możemy pomóc",
    fields: {
      firstName: "Imię",
      company: "Nazwa firmy",
      email: "E-mail",
      phone: "Telefon",
      message: "Opisz swój największy problem ze sprzedażą",
    },
    consent: "Zgadzam się na przetwarzanie danych osobowych zgodnie z Polityką Prywatności",
    submit: "Umów rozmowę",
    success: "Dziękujemy! Skontaktujemy się w ciągu 15 minut.",
  },
  
  footer: {
    company: "Handlowiec Sp. z o.o.",
    address: "ul. Przykładowa 123, 00-001 Warszawa",
    nip: "NIP: 123-456-78-90",
    email: "kontakt@handlowiec.pl",
    phone: "+48 123 456 789",
    privacy: "Polityka Prywatności",
    terms: "Regulamin",
    copyright: "© 2024 Handlowiec. Wszystkie prawa zastrzeżone.",
  },
};

export const LEAD_SOURCES = {
  DIRECT: 'direct',
  LINKEDIN: 'linkedin',
  GOOGLE_ADS: 'google_ads',
  ORGANIC: 'organic',
  REFERRAL: 'referral',
  EMAIL: 'email',
  SOCIAL: 'social',
} as const;

export const FORM_VALIDATION = {
  firstName: {
    required: "Imię jest wymagane",
    minLength: { value: 2, message: "Imię musi mieć minimum 2 znaki" },
    maxLength: { value: 50, message: "Imię może mieć maksymalnie 50 znaków" },
  },
  company: {
    required: "Nazwa firmy jest wymagana",
    minLength: { value: 2, message: "Nazwa firmy musi mieć minimum 2 znaki" },
    maxLength: { value: 100, message: "Nazwa firmy może mieć maksymalnie 100 znaków" },
  },
  email: {
    required: "E-mail jest wymagany",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Nieprawidłowy format e-mail",
    },
  },
  phone: {
    required: "Telefon jest wymagany",
    pattern: {
      value: /^[\+]? [0-9\s\-\(\)]{9,15}$/,
      message: "Nieprawidłowy format telefonu",
    },
  },
  message: {
    required: "Wiadomość jest wymagana",
    minLength: { value: 10, message: "Wiadomość musi mieć minimum 10 znaków" },
    maxLength: { value: 500, message: "Wiadomość może mieć maksymalnie 500 znaków" },
  },
  consent: {
    required: "Zgoda na przetwarzanie danych jest wymagana",
  },
} as const;

export const API_ENDPOINTS = {
  SUBMIT_LEAD: '/api/submit-lead',
  ANALYTICS: '/api/analytics',
  HEALTH: '/api/health',
} as const;

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_SUCCESS: 'form_success',
  FORM_ERROR: 'form_error',
  CTA_CLICK: 'cta_click',
  PHONE_CLICK: 'phone_click',
  EMAIL_CLICK: 'email_click',
  SOCIAL_CLICK: 'social_click',
} as const; 