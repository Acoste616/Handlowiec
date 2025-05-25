# 🚀 BezHandlowca.pl - Instrukcje Konfiguracji

## ✅ Status: GOTOWE DO URUCHOMIENIA

Wszystkie pliki zostały skonfigurowane z Twoimi kluczami Supabase. Wystarczy wykonać poniższe kroki:

## 📋 Krok 1: Uruchomienie Migracji Bazy Danych

### Opcja A: Ręczne uruchomienie (ZALECANE)
1. Idź do **Supabase Dashboard**: https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac
2. Kliknij **SQL Editor** w menu po lewej
3. Skopiuj **całą zawartość** pliku `supabase/migrations/001_init.sql`
4. Wklej do SQL Editor
5. Kliknij **"Run"** aby wykonać migrację

### Opcja B: Przez Supabase CLI
```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Zaloguj się
supabase login

# Połącz z projektem
supabase link --project-ref dchwetwqmmeqyxlcqlac

# Uruchom migracje
supabase db push
```

## 📋 Krok 2: Wypełnienie Danymi Testowymi

Po uruchomieniu migracji, wykonaj:

```bash
npm run seed
```

To utworzy:
- **3 przykładowych klientów** (TechCorp, BizSolutions, InnovateCorp)
- **12-15 użytkowników** na każdego klienta
- **90-240 leadów** z polskimi danymi
- **Przykładowe aktywności** i rotacje zespołu

## 📋 Krok 3: Uruchomienie Aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod: **http://localhost:3000**

## 🔧 Konfiguracja Produkcyjna (Vercel)

### Zmienne Środowiskowe w Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://dchwetwqmmeqyxlcqlac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE
NEXT_PUBLIC_APP_URL=https://twoja-domena.vercel.app
NODE_ENV=production
```

### Konfiguracja URL w Supabase:
1. Idź do **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Dodaj swoją domenę Vercel do **"Site URL"** i **"Redirect URLs"**

## 🎯 Funkcjonalności Gotowe do Użycia

### ✅ Backend API
- **Dashboard Stats**: `GET /api/client/dashboard/stats`
- **Import CSV**: `POST /api/client/leads/import`
- **Team Rotations**: `GET/POST /api/client/team/rotation`

### ✅ Funkcje Biznesowe
- **Multi-tenant Architecture** - Pełne oddzielenie danych klientów
- **Real-time Dashboard** - Statystyki na żywo
- **Import CSV** - Wsparcie dla polskich nagłówków
- **Team Rotations** - Algorytmy 30/90 dni
- **Row Level Security** - Bezpieczeństwo na poziomie bazy danych

### ✅ Struktura Bazy Danych
- `users` - Użytkownicy z przypisaniem do klientów
- `clients` - Klienci (firmy) z ustawieniami  
- `leads` - Leady z pełnym cyklem sprzedaży
- `activities` - Historia aktywności
- `team_rotations` - Rotacje zespołu

## 🔐 Bezpieczeństwo

### Row Level Security (RLS)
- ✅ Wszystkie tabele mają włączone RLS
- ✅ Użytkownicy widzą tylko dane swojego klienta
- ✅ Admini mają pełny dostęp
- ✅ API używa service key dla operacji systemowych

### Middleware
- ✅ Automatyczna weryfikacja sesji
- ✅ Przekierowania dla niezalogowanych
- ✅ Injection kontekstu klienta

## 🛠️ Pliki Skonfigurowane

### ✅ Konfiguracja Supabase
- `src/lib/supabase/client.ts` - Client-side konfiguracja
- `src/lib/supabase/server.ts` - Server-side konfiguracja
- `middleware.ts` - Middleware z auth
- `env.example` - Przykład zmiennych środowiskowych
- `.env.local` - Lokalne zmienne środowiskowe

### ✅ Baza Danych
- `supabase/migrations/001_init.sql` - Kompletna migracja
- `scripts/seed.ts` - Dane testowe z polskimi nazwami
- `scripts/run-migration.ts` - Sprawdzanie statusu bazy

### ✅ API Endpoints
- Dashboard stats z real-time
- Import CSV z polskimi nagłówkami
- Team rotations z algorytmami
- Walidacja Zod dla wszystkich API

## 📞 Wsparcie

### W przypadku problemów:
1. **Sprawdź logi** w Vercel Dashboard
2. **Sprawdź logi** w Supabase Dashboard → Logs  
3. **Uruchom lokalnie** `npm run dev` dla debugowania
4. **Sprawdź status bazy**: `npx tsx scripts/run-migration.ts`

## 🚀 Następne Kroki

1. **Uruchom migrację** (Krok 1)
2. **Wypełnij danymi** (Krok 2) 
3. **Testuj lokalnie** (Krok 3)
4. **Deploy na Vercel** z zmiennymi środowiskowymi
5. **Skonfiguruj domeny** w Supabase

---

## 🎉 PROJEKT GOTOWY DO PRODUKCJI!

**Backend**: ✅ Kompletny  
**API**: ✅ Zaimplementowane  
**Baza danych**: ✅ Skonfigurowana  
**Bezpieczeństwo**: ✅ RLS + Middleware  
**Real-time**: ✅ Supabase Realtime  
**Import**: ✅ CSV z polskimi nagłówkami  
**Rotacje**: ✅ Algorytmy 30/90 dni 