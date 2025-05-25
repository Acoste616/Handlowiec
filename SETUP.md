# 🚀 BezHandlowca.pl - Setup Guide

## 🚀 Szybki Start

### 1. Klonowanie Repozytorium
```bash
git clone https://github.com/Acoste616/Handlowiec.git
cd handlowiec
```

### 2. Instalacja Zależności
```bash
npm install
```

### 3. Konfiguracja Środowiska

Skopiuj plik `.env.example` jako `.env.local`:
```bash
cp env.example .env.local
```

Twój plik `.env.local` powinien zawierać:
```env
# Supabase Configuration - SKONFIGUROWANE
NEXT_PUBLIC_SUPABASE_URL=https://dchwetwqmmeqyxlcqlac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Konfiguracja Bazy Danych Supabase

#### A. Uruchomienie Migracji
```bash
# Zainstaluj Supabase CLI (jeśli nie masz)
npm install -g supabase

# Zaloguj się do Supabase
supabase login

# Połącz z projektem
supabase link --project-ref dchwetwqmmeqyxlcqlac

# Uruchom migracje
supabase db push
```

#### B. Alternatywnie - Ręczne Uruchomienie SQL
Jeśli masz problemy z CLI, możesz uruchomić SQL bezpośrednio w Supabase Dashboard:

1. Idź do https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac
2. Przejdź do SQL Editor
3. Skopiuj i uruchom zawartość pliku `supabase/migrations/001_init.sql`

### 5. Wypełnienie Danymi Testowymi
```bash
npm run seed
```

To utworzy:
- 3 przykładowych klientów
- 12-15 użytkowników na klienta
- 90-240 leadów z polskimi danymi
- Przykładowe aktywności i rotacje zespołu

### 6. Uruchomienie Aplikacji
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🔧 Konfiguracja Produkcyjna (Vercel)

### 1. Zmienne Środowiskowe w Vercel
W panelu Vercel dodaj następujące zmienne środowiskowe:

```
NEXT_PUBLIC_SUPABASE_URL=https://dchwetwqmmeqyxlcqlac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE
NEXT_PUBLIC_APP_URL=https://twoja-domena.vercel.app
NODE_ENV=production
```

### 2. Konfiguracja Domeny w Supabase
1. Idź do Supabase Dashboard → Authentication → URL Configuration
2. Dodaj swoją domenę Vercel do "Site URL" i "Redirect URLs"

## 📊 Funkcjonalności

### ✅ Zaimplementowane
- **Multi-tenant Architecture** - Pełne oddzielenie danych klientów
- **Real-time Dashboard** - Statystyki na żywo z Supabase Realtime
- **Import CSV** - Wsparcie dla polskich nagłówków
- **Team Rotations** - Algorytmy 30/90 dni
- **API Endpoints** - Kompletne REST API
- **Row Level Security** - Bezpieczeństwo na poziomie bazy danych
- **TypeScript** - Pełne typowanie z Zod validation

### 🔄 API Endpoints
- `GET /api/client/dashboard/stats` - Statystyki dashboardu
- `POST /api/client/leads/import` - Import leadów z CSV
- `GET/POST /api/client/team/rotation` - Zarządzanie rotacjami

### 📁 Struktura Bazy Danych
- `users` - Użytkownicy z przypisaniem do klientów
- `clients` - Klienci (firmy) z ustawieniami
- `leads` - Leady z pełnym cyklem sprzedaży
- `activities` - Historia aktywności
- `team_rotations` - Rotacje zespołu

## 🛠️ Rozwój

### Dodawanie Nowych Funkcji
1. Dodaj migrację SQL w `supabase/migrations/`
2. Zaktualizuj typy w `src/lib/supabase/client.ts`
3. Dodaj walidację Zod w `src/lib/validations/`
4. Stwórz API endpoint w `src/app/api/`
5. Dodaj hook React w `src/hooks/`

### Testowanie
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run lint        # Linting
npm run type-check  # TypeScript check
```

## 🔐 Bezpieczeństwo

### Row Level Security (RLS)
Wszystkie tabele mają włączone RLS z politykami:
- Użytkownicy widzą tylko dane swojego klienta
- Admini mają pełny dostęp
- API używa service key dla operacji systemowych

### Middleware
- Automatyczna weryfikacja sesji
- Przekierowania dla niezalogowanych
- Injection kontekstu klienta

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w Vercel Dashboard
2. Sprawdź logi w Supabase Dashboard → Logs
3. Uruchom `npm run dev` lokalnie dla debugowania

## 🚀 Status Projektu

**GOTOWE DO PRODUKCJI** ✅
- Backend: Kompletny
- API: Zaimplementowane
- Baza danych: Skonfigurowana
- Bezpieczeństwo: RLS + Middleware
- Real-time: Supabase Realtime
- Import: CSV z polskimi nagłówkami
- Rotacje: Algorytmy 30/90 dni

## 📋 Wymagania

- Node.js 18+ 
- npm 9+
- Konto Supabase
- Git

## 🛠️ Instalacja

### 1. Klonowanie repozytorium

```bash
git clone <repository-url>
cd handlowiec
```

### 2. Instalacja dependencies

```bash
npm install
```

### 3. Konfiguracja Supabase

#### 3.1 Utworzenie projektu Supabase

1. Idź na [supabase.com](https://supabase.com)
2. Utwórz nowy projekt
3. Skopiuj URL projektu i klucze API

#### 3.2 Konfiguracja zmiennych środowiskowych

```bash
cp env.example .env.local
```

Wypełnij `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### 3.3 Uruchomienie migracji bazy danych

W Supabase Dashboard > SQL Editor, uruchom:

```sql
-- Skopiuj zawartość z supabase/migrations/001_init.sql
```

Lub użyj Supabase CLI:

```bash
npx supabase db reset
```

### 4. Seed danych testowych

```bash
npm run seed
```

To utworzy:
- 3 przykładowych klientów
- 12-15 użytkowników (agentów/managerów)
- 90-240 leadów
- Aktywności i rotacje zespołu

### 5. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`

## 🔐 Dostęp do panelu klienta

Po uruchomieniu seed, możesz zalogować się jako:

**Przykładowi użytkownicy** (sprawdź w konsoli po seed):
- Email: `jan.kowalski@techflow.pl`
- Hasło: Musisz utworzyć w Supabase Auth

### Tworzenie użytkownika testowego:

1. Supabase Dashboard > Authentication > Users
2. Invite user z emailem z seed
3. Ustaw hasło
4. Zaloguj się na `/client/login`

## 📊 Funkcje

### ✅ Zaimplementowane

- **Multi-tenant architecture** z RLS
- **Dashboard** z real-time stats
- **Import leadów** z CSV (max 1000)
- **Team rotations** (30/90 dni)
- **Real-time updates** via Supabase
- **API validation** z Zod
- **Activity timeline** z auto-tracking

### 🔄 W trakcie implementacji

- Frontend components
- Report generation (PDF/Excel)
- Screen-share requests
- Advanced filtering

### ❌ Nie zaimplementowane

- Email notifications
- Advanced analytics
- Mobile app
- Integrations (HubSpot, etc.)

## 🏗️ Architektura

```
src/
├── app/
│   ├── api/client/          # Multi-tenant API routes
│   │   ├── dashboard/       # Dashboard stats
│   │   ├── leads/          # Lead management + import
│   │   └── team/           # Team rotations
│   └── client/             # Client panel pages
├── lib/
│   ├── supabase/           # DB client config
│   └── validations/        # Zod schemas
├── hooks/                  # React hooks (realtime)
└── components/             # UI components
```

## 🔧 API Endpoints

### Dashboard
- `GET /api/client/dashboard/stats?period=30`

### Leads
- `GET /api/client/leads?status=new&page=1`
- `POST /api/client/leads` - Create lead
- `PUT /api/client/leads/import` - Parse CSV
- `POST /api/client/leads/import` - Import leads

### Team
- `GET /api/client/team/rotation?type=30_days`
- `POST /api/client/team/rotation` - Create rotation
- `PUT /api/client/team/rotation?type=30_days` - Calculate schedule

## 🧪 Testing

```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build
docker build -t bezhandlowca .

# Run
docker run -p 3000:3000 bezhandlowca
```

## 🐛 Troubleshooting

### Supabase Connection Issues

1. Sprawdź URL i klucze w `.env.local`
2. Upewnij się, że RLS policies są aktywne
3. Sprawdź logi w Supabase Dashboard

### Import CSV nie działa

1. Sprawdź format CSV (UTF-8)
2. Maksymalny rozmiar: 10MB
3. Wymagane kolumny: `first_name`, `last_name`, `company`, `email`

### Real-time nie działa

1. Sprawdź połączenie internetowe
2. Sprawdź logi w konsoli przeglądarki
3. Upewnij się, że Supabase Realtime jest włączony

## 📞 Support

- **Issues**: GitHub Issues
- **Docs**: `/docs` folder
- **Email**: support@bezhandlowca.pl

## 🔄 Updates

Sprawdzaj regularnie:

```bash
git pull origin main
npm install
npm run build
```

---

**Status**: ✅ FAZA 1 & 2 Complete | 🔄 FAZA 3 In Progress

**Last Updated**: $(date)
**Version**: 1.0.0-beta 