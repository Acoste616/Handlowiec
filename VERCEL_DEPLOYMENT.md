# 🚀 Vercel Deployment Guide

## ✅ Status: Gotowe do Deployment

Projekt jest w pełni skonfigurowany i gotowy do wdrożenia na Vercel.

## 📋 Krok 1: Przygotowanie Vercel

### 1.1 Połącz z GitHub
1. Idź na [vercel.com](https://vercel.com)
2. Zaloguj się i kliknij **"New Project"**
3. Wybierz repozytorium: `Acoste616/Handlowiec`
4. Kliknij **"Import"**

### 1.2 Konfiguracja Build
- **Framework Preset**: Next.js
- **Root Directory**: `./` (domyślnie)
- **Build Command**: `npm run build` (domyślnie)
- **Output Directory**: `.next` (domyślnie)

## 📋 Krok 2: Zmienne Środowiskowe

W sekcji **Environment Variables** dodaj następujące zmienne:

### 🔑 Supabase (WYMAGANE)
```
NEXT_PUBLIC_SUPABASE_URL=https://dchwetwqmmeqyxlcqlac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE
```

### 🌐 App Configuration (WYMAGANE)
```
NEXT_PUBLIC_APP_URL=https://twoja-domena.vercel.app
NODE_ENV=production
```

### 📧 Email (OPCJONALNE)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj-email@gmail.com
SMTP_PASS=twoje-haslo-aplikacji
```

### 📊 Google Sheets (OPCJONALNE)
```
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=1234567890abcdef
```

### 📈 Analytics (OPCJONALNE)
```
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
HOTJAR_ID=1234567
LINKEDIN_PIXEL_ID=123456
```

## 📋 Krok 3: Deploy

1. Kliknij **"Deploy"**
2. Poczekaj na zakończenie buildu (~2-3 minuty)
3. Sprawdź czy deployment przeszedł pomyślnie

## 📋 Krok 4: Konfiguracja Supabase

### 4.1 Dodaj domenę Vercel do Supabase
1. Idź do [Supabase Dashboard](https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac)
2. **Authentication** → **URL Configuration**
3. Dodaj do **Site URL**: `https://twoja-domena.vercel.app`
4. Dodaj do **Redirect URLs**: 
   - `https://twoja-domena.vercel.app/client/login`
   - `https://twoja-domena.vercel.app/admin/login`

### 4.2 Uruchom migracje bazy danych
1. **SQL Editor** w Supabase Dashboard
2. Skopiuj zawartość `supabase/migrations/001_init.sql`
3. Kliknij **"Run"**

### 4.3 Wypełnij danymi testowymi
Po deployment uruchom lokalnie:
```bash
npm run seed
```

## 🔧 Troubleshooting

### Build Fails
- Sprawdź czy wszystkie wymagane zmienne środowiskowe są ustawione
- Sprawdź logi buildu w Vercel Dashboard

### Fonts nie ładują się
- To normalne podczas buildu - fonty będą działać po deployment
- Dodaliśmy fallback fonts dla lepszej wydajności

### API nie działa
- Sprawdź czy `NEXT_PUBLIC_SUPABASE_URL` i `SUPABASE_SERVICE_KEY` są ustawione
- Sprawdź czy migracje bazy danych zostały uruchomione

### 404 na stronach
- Sprawdź czy build przeszedł pomyślnie
- Sprawdź routing w `next.config.js`

## 🎯 Po Deployment

### Testowanie
1. **Strona główna**: `https://twoja-domena.vercel.app`
2. **Panel klienta**: `https://twoja-domena.vercel.app/client/login`
3. **Panel admin**: `https://twoja-domena.vercel.app/admin/login`
4. **API Health**: `https://twoja-domena.vercel.app/api/health`

### Monitoring
- **Vercel Analytics**: Automatycznie włączone
- **Logi**: Vercel Dashboard → Functions
- **Performance**: Vercel Dashboard → Speed Insights

## 🚀 Następne Kroki

1. **Skonfiguruj domenę własną** (opcjonalnie)
2. **Dodaj SSL certificate** (automatycznie przez Vercel)
3. **Skonfiguruj monitoring** (Sentry, LogRocket)
4. **Dodaj backup bazy danych** (Supabase)

---

## ✅ Checklist Deployment

- [ ] Repozytorium połączone z Vercel
- [ ] Zmienne środowiskowe ustawione
- [ ] Build przeszedł pomyślnie
- [ ] Domena dodana do Supabase
- [ ] Migracje bazy danych uruchomione
- [ ] Dane testowe wypełnione
- [ ] Strona działa poprawnie
- [ ] API endpoints działają
- [ ] Logowanie działa

**Status**: 🎉 **GOTOWE DO PRODUKCJI!** 