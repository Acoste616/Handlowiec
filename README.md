# BezHandlowca.pl - Platforma Outsourcingu Sprzedażowego

Kompletna platforma do zarządzania outsourcingiem sprzedażowym z trzema oddzielnymi modułami:

## 🌐 Struktura Aplikacji

### 1. **Strona Główna** (`/`)
**Cel**: Pozyskiwanie nowych klientów  
**Dla kogo**: Firmy rozważające outsourcing sprzedaży

**Funkcje**:
- Landing page z ofertą usług
- Formularze kontaktowe dla leadów
- Case studies i referencje
- Informacje o procesie współpracy
- Call-to-action do zgłoszenia się

**Dostęp**: Publiczny, bez logowania

---

### 2. **Panel Klienta** (`/client/*`)
**Cel**: Kontrola i transparentność dla aktywnych klientów  
**Dla kogo**: Firmy już korzystające z usług BezHandlowca.pl

**Funkcje**:
- 📊 **Dashboard**: Metryki w czasie rzeczywistym, aktywność zespołu
- 🎯 **Podgląd leadów**: Timeline, nagrania rozmów, możliwość dołączenia do call
- 👥 **Aktywność zespołu**: Status handlowców, statystyki, screen share
- 📈 **Raporty**: ROI, lejek sprzedaży, skuteczność źródeł, eksport PDF/Excel
- 💬 **Komunikacja**: Chat z Account Managerem, powiadomienia
- ⚙️ **Ustawienia**: Branding, integracje, powiadomienia

**Konta testowe**:
- `techflow@bezhandlowca.pl` / `client2024`
- `probiznes@bezhandlowca.pl` / `client2024`

**Dostęp**: `/client/login` - wymagane uwierzytelnienie

---

### 3. **Panel Administracyjny** (`/admin/*`) 
**Cel**: Zarządzanie operacyjne dla zespołu BezHandlowca.pl  
**Dla kogo**: Handlowcy, managerowie, właściciel firmy

**Funkcje**:
- 📋 **Zarządzanie leadami**: Przypisywanie, statusy, notatki
- 📊 **Statystyki operacyjne**: KPI zespołu, performance tracking
- 👥 **Zarządzanie zespołem**: Przydziały, harmonogramy
- ⚙️ **Konfiguracja systemu**: Integracje, ustawienia

**Dostęp**: `/admin/login` - wewnętrzne uwierzytelnienie

---

## 🚀 Uruchomienie

```bash
# Instalacja
npm install

# Development
npm run dev

# Build
npm run build

# Start
npm start
```

Strona dostępna na: http://localhost:3000

## 🔑 Logowanie

### Panel Klienta
Przejdź na: http://localhost:3000/client/login
- **TechFlow Solutions**: `techflow@bezhandlowca.pl` / `client2024`
- **ProBiznes**: `probiznes@bezhandlowca.pl` / `client2024`

### Panel Administracyjny
Przejdź na: http://localhost:3000/admin/login
- **Admin**: `admin@bezhandlowca.pl` / `admin2024`

## 🏗️ Architektura

```
├── src/app/
│   ├── page.tsx                 # Strona główna (marketing)
│   ├── client/                  # Panel Klienta
│   │   ├── login/              # Logowanie klientów
│   │   ├── dashboard/          # Dashboard klienta
│   │   ├── leads/              # Podgląd leadów
│   │   ├── team/               # Aktywność zespołu
│   │   ├── reports/            # Raporty i analizy
│   │   ├── messages/           # Komunikacja
│   │   └── settings/           # Ustawienia klienta
│   └── admin/                   # Panel Administracyjny
│       ├── login/              # Logowanie admin
│       ├── dashboard/          # Dashboard admin
│       ├── leads/              # Zarządzanie leadami
│       ├── reports/            # Raporty operacyjne
│       └── settings/           # Ustawienia systemu
├── src/components/             # Komponenty UI
├── src/hooks/                  # Custom hooks
├── src/services/              # Integracje (Google Sheets, Email, etc.)
└── src/utils/                 # Utilities
```

## 🔧 Konfiguracja

### Zmienne środowiskowe
Utwórz plik `.env.local`:

```env
# Google Sheets
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_SPREADSHEET_ID="your_sheet_id"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# Development
NODE_ENV="development"
DISABLE_EXTERNAL_SERVICES="true"  # Wyłącza zewnętrzne serwisy w dev
```

## 🎯 Cele Biznesowe

### Strona Główna
- **Konwersja**: Przekonanie firm do skorzystania z usług
- **Lead Generation**: Pozyskanie kontaktów zainteresowanych firm
- **Trust Building**: Budowanie zaufania przez case studies

### Panel Klienta  
- **Transparentność**: Pełen wgląd w procesy sprzedażowe
- **Kontrola**: Możliwość monitorowania i interwencji
- **ROI**: Jasne raportowanie zwrotu z inwestycji

### Panel Administracyjny
- **Efektywność**: Optymalizacja pracy zespołu
- **Jakość**: Monitoring performance handlowców
- **Skalowanie**: Zarządzanie rosnącą liczbą klientów

## 📱 Responsywność

Wszystkie moduły są w pełni responsywne:
- Mobile-first design
- Funkcjonalność na wszystkich urządzeniach
- PWA capabilities (planowane)

## 🔐 Bezpieczeństwo

- Multi-tenancy z separacją danych
- Szyfrowanie wrażliwych informacji
- Rate limiting na API
- GDPR compliance
- Session management z automatycznym logout

---

**Status**: ✅ **Aplikacja działa poprawnie**

Wszystkie moduły są gotowe do użytku. Panel Klienta oferuje pełną transparentność, Panel Administracyjny umożliwia zarządzanie, a Strona Główna skutecznie pozyskuje nowych klientów. 