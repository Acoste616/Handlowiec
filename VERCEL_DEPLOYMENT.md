# 🚀 Deployment do Vercel - BezHandlowca.pl

## 📋 Wymagane Zmienne Środowiskowe

Przed deploymentem ustaw następujące zmienne środowiskowe w Vercel Dashboard:

### 🔑 Supabase Configuration (WYMAGANE)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dchwetwqmmeqyxlcqlac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE
```

### 🌐 App Configuration
```bash
NEXT_PUBLIC_APP_NAME=BezHandlowca
NEXT_PUBLIC_APP_URL=https://bezhandlowca.pl
NODE_ENV=production
```

### 📧 Email Configuration (Opcjonalne)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=leads@bezhandlowca.pl
EMAIL_TO=leads@bezhandlowca.pl
```

### 📊 Analytics (Opcjonalne)
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_LINKEDIN_PIXEL_ID=123456
NEXT_PUBLIC_HOTJAR_ID=123456
NEXT_PUBLIC_HOTJAR_VERSION=6
```

### 🔒 Security
```bash
FORM_SECRET_KEY=your-secret-key-here
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=900000
```

## 🚀 Kroki Deployment

### 1. Przygotowanie Repozytorium
```bash
# Upewnij się, że wszystkie zmiany są w Git
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Konfiguracja Vercel

1. **Zaloguj się do Vercel**: https://vercel.com
2. **Import Project**: Kliknij "New Project" → Import z GitHub
3. **Wybierz Repo**: `Acoste616/Handlowiec`
4. **Framework**: Next.js (auto-detect)
5. **Root Directory**: `./` (domyślnie)

### 3. Ustawienie Zmiennych Środowiskowych

W Vercel Dashboard:
1. Przejdź do **Settings** → **Environment Variables**
2. Dodaj wszystkie zmienne z sekcji powyżej
3. Ustaw **Environment** na `Production`, `Preview`, i `Development`

### 4. Build Settings

Vercel automatycznie wykryje:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy

1. Kliknij **Deploy**
2. Poczekaj na zakończenie buildu (~2-3 minuty)
3. Sprawdź logi w przypadku błędów

## 🗄️ Konfiguracja Bazy Danych

### 1. Uruchom Migrację w Supabase

1. Przejdź do **Supabase Dashboard**: https://supabase.com/dashboard
2. Wybierz projekt: `dchwetwqmmeqyxlcqlac`
3. Przejdź do **SQL Editor**
4. Skopiuj i uruchom zawartość pliku: `supabase/migrations/001_init.sql`

### 2. Sprawdź Tabele

Powinny zostać utworzone tabele:
- `users` - Użytkownicy systemu
- `clients` - Klienci (firmy)
- `leads` - Leady sprzedażowe
- `activities` - Historia aktywności
- `team_rotations` - Rotacje zespołu

### 3. Konfiguracja Authentication

1. W Supabase Dashboard → **Authentication** → **Settings**
2. **Site URL**: Ustaw na URL Vercel (np. `https://your-app.vercel.app`)
3. **Redirect URLs**: Dodaj:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/dashboard`

## 🧪 Testowanie Deployment

### 1. Sprawdź API Endpoints

```bash
# Test dashboard stats
curl https://your-app.vercel.app/api/client/dashboard/stats?clientId=test

# Test team rotation
curl https://your-app.vercel.app/api/client/team/rotation?clientId=test
```

### 2. Sprawdź Frontend

1. Otwórz aplikację w przeglądarce
2. Sprawdź czy strona główna się ładuje
3. Przetestuj formularz kontaktowy

## 🌱 Dodanie Danych Testowych

Po deployment uruchom seed script:

```bash
# Lokalnie (z ustawionymi zmiennymi środowiskowymi)
npm run seed

# Lub bezpośrednio w Supabase SQL Editor
# Skopiuj zawartość z scripts/seed.ts i dostosuj do SQL
```

## 🔧 Rozwiązywanie Problemów

### Build Errors

1. **Supabase Connection Error**:
   - Sprawdź czy wszystkie zmienne Supabase są ustawione
   - Zweryfikuj klucze w Supabase Dashboard

2. **ESLint Errors**:
   - Sprawdź `.eslintrc.json`
   - Uruchom `npm run lint` lokalnie

3. **TypeScript Errors**:
   - Uruchom `npm run type-check` lokalnie
   - Sprawdź importy w plikach API

### Runtime Errors

1. **API Routes 500 Error**:
   - Sprawdź logi w Vercel Dashboard → Functions
   - Zweryfikuj połączenie z Supabase

2. **Database Connection Issues**:
   - Sprawdź RLS policies w Supabase
   - Zweryfikuj service key permissions

## 📊 Monitoring

### Vercel Analytics
- Automatycznie włączone dla wszystkich projektów
- Dashboard dostępny w Vercel → Analytics

### Supabase Monitoring
- Dashboard → Settings → API
- Sprawdzaj usage i performance

## 🔄 Aktualizacje

### Automatyczne Deployment
- Każdy push do `main` branch automatycznie triggeruje deployment
- Preview deployments dla pull requestów

### Manual Redeploy
1. Vercel Dashboard → Deployments
2. Kliknij "Redeploy" na ostatnim deployment

## ✅ Checklist Deployment

- [ ] Wszystkie zmienne środowiskowe ustawione
- [ ] Migracja bazy danych uruchomiona
- [ ] Authentication URLs skonfigurowane
- [ ] Build przechodzi bez błędów
- [ ] API endpoints działają
- [ ] Frontend ładuje się poprawnie
- [ ] Dane testowe dodane (opcjonalne)

## 🆘 Wsparcie

W przypadku problemów:
1. Sprawdź logi w Vercel Dashboard
2. Zweryfikuj konfigurację Supabase
3. Przetestuj lokalnie z tymi samymi zmiennymi środowiskowymi

---

**Status**: ✅ Gotowe do deployment
**Czas setup**: ~10 minut
**Wymagania**: Konto Vercel + Supabase project 