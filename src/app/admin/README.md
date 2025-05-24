# Panel CRM BezHandlowca

## Struktura Aplikacji

### 🔐 Autoryzacja
- **Login**: `/admin/login` - Strona logowania z 3 kontami testowymi
- **AuthProvider**: Centralne zarządzanie sesją użytkownika (24h)
- **Automatyczne przekierowania**: Nieautoryzowani użytkownicy → `/admin/login`

### 🎛️ Layout i Nawigacja
- **Responsywny sidebar** z aktywnym podświetleniem
- **Mobile-friendly** z hamburger menu
- **User avatar** z inicjałami i opcją wylogowania
- **AuthProvider wrapper** w głównym layout

### 📊 Główne Moduły

#### 1. Dashboard (`/admin/dashboard`)
- **Statystyki** - karty z kluczowymi metrykami
- **Tabela leadów** z filtrami (Wszystkie/Nowe/Moje)
- **Modal edycji** leadów z pełną funkcjonalnością
- **Quick actions** - telefon, email, przypisywanie

#### 2. Zarządzanie Leadami (`/admin/leads`)
- **Zaawansowane filtry** - status, przypisanie, wyszukiwanie
- **Przypisywanie** leadów do handlowców (modal)
- **Edycja priorytetów** klikiem
- **Szczegółowa edycja** - status, notatki, wartość szacunkowa, następna akcja
- **Akcje bezpośrednie** - telefon, email

#### 3. Raporty i Analizy (`/admin/reports`)
- **Zakresy czasowe** - 7d/30d/90d/1y
- **Kluczowe metryki** - leady, konwersja, przychód, średnia wartość
- **Wykresy analityczne**:
  - Leady według statusu
  - Leady według źródła  
  - Leady według handlowca
  - Dzienna aktywność (ostatnie 7 dni)
- **Trendy miesięczne** - tabela z 6 miesięcy
- **Eksport** - CSV i drukowanie

#### 4. Ustawienia Systemu (`/admin/settings`)
**4 główne sekcje:**

##### Ogólne
- Dane firmy (nazwa, email, telefon)
- Domyślny status leadów
- Czas przechowywania danych
- Automatyczne przypisywanie

##### Użytkownicy  
- Lista wszystkich użytkowników
- Role (Admin/User)
- Status aktywności
- Możliwość dodawania/edycji/dezaktywacji

##### Powiadomienia
- Email notifications on/off
- Slack integration z webhook URL
- Częstotliwość raportów (dzienny/tygodniowy)

##### Integracje
- **Google Sheets** - status połączenia, testy
- **Gmail API** - konfiguracja wysyłania
- **Slack** - webhook, kanał, testy

## 🔑 Konta Testowe

```
admin@bezhandlowca.pl / bezhandlowca2024 (Administrator)
bartek@bezhandlowca.pl / bezhandlowca2024 (Bartek Nowak) 
marta@bezhandlowca.pl / bezhandlowca2024 (Marta Kowalska)
```

## 🛠️ Technologie

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks, AuthProvider context
- **Data Fetching**: Custom API client z autoryzacją
- **Date Handling**: date-fns z lokalizacją PL
- **Authentication**: localStorage z expiry (24h)

## 🚀 Uruchomienie

```bash
npm run dev        # Development server na :3000
npm run build      # Production build
npm run type-check # TypeScript validation
```

## 📂 Struktura Plików

```
src/app/admin/
├── layout.tsx           # AuthProvider wrapper
├── login/page.tsx       # Strona logowania
├── dashboard/
│   ├── layout.tsx       # Sidebar + autoryzacja
│   └── page.tsx         # Dashboard główny
├── leads/page.tsx       # Zarządzanie leadami
├── reports/page.tsx     # Raporty i analizy  
└── settings/page.tsx    # Ustawienia systemu

src/hooks/
└── useAuth.tsx          # Context autoryzacji

src/utils/
└── api.ts              # HTTP client z auth
```

## ✨ Główne Funkcjonalności

### Lead Management
- ✅ Filtry i wyszukiwanie
- ✅ Przypisywanie do handlowców
- ✅ Edycja statusów i priorytetów
- ✅ Notatki i akcje następne
- ✅ Bezpośredni kontakt (tel/email)

### Reporting
- ✅ Wykresy i statystyki
- ✅ Trendy czasowe
- ✅ Eksport danych
- ✅ Analizy konwersji

### System Management  
- ✅ Zarządzanie użytkownikami
- ✅ Konfiguracja powiadomień
- ✅ Integracje zewnętrzne
- ✅ Ustawienia firmowe

### UX/UI
- ✅ Responsywny design
- ✅ Intuicyjna nawigacja
- ✅ Loading states
- ✅ Error handling
- ✅ Polskie tłumaczenia

## 🔗 Powiązania z Backend

System wykorzystuje istniejące API endpoints:
- `GET /api/admin/leads` - pobieranie leadów
- `GET /api/admin/stats` - statystyki dashboard
- `PATCH /api/admin/leads/:id` - aktualizacja leadów
- `PATCH /api/admin/leads/:id/assign` - przypisywanie

---

**Projekt gotowy do produkcji!** 🎉 