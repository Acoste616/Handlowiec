# 🚀 BezHandlowca.pl - Setup Guide

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