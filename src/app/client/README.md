# Panel Klienta - BezHandlowca.pl

Kompletny panel zarządzania sprzedażą dla klientów korzystających z usług outsourcingu handlowego.

## 🎯 Główne funkcje

### 1. Dashboard (/client/dashboard)
- **Metryki w czasie rzeczywistym**: aktywni handlowcy, leady dziś/tydzień/miesiąc, wartość pipeline, konwersja
- **Live feed aktywności**: co dzieje się teraz z Twoimi leadami
- **Top performers**: najlepsi handlowcy tego miesiąca
- **Alerty**: leady bez kontaktu >24h, follow-upy na dziś, wysokowartościowe leady
- **Szybkie akcje**: sprawdź aktywne rozmowy, wygeneruj raport, skontaktuj się z zespołem

### 2. Podgląd leadów (/client/leads)
- **Zaawansowane filtry**: status, handlowiec, źródło, priorytet, wyszukiwanie
- **Timeline aktywności**: kompletna historia każdego leada
- **Nagrania rozmów**: odsłuchaj, zobacz transkrypcję, podsumowania
- **Quick actions**: dołącz do rozmowy, prześlij podsumowanie, zmień priorytet
- **Szczegółowe informacje**: prawdopodobieństwo zamknięcia, następne kroki, notatki

### 3. Aktywność zespołu (/client/team)
- **Status na żywo**: online/offline/w rozmowie/przerwa
- **Statystyki dzienne**: telefony, emaile, rozmowy, leady w pipeline
- **Wydajność**: konwersja, średni czas reakcji, wartość dealów
- **Podgląd ekranu**: poproś handlowca o screen share (za zgodą)
- **Harmonogram**: godziny pracy, następne spotkania

### 4. Raporty i analizy (/client/reports)
- **ROI**: zwrot z inwestycji w outsourcing sprzedaży
- **Lejek sprzedaży**: wizualizacja konwersji na każdym etapie
- **Skuteczność źródeł**: które kanały przynoszą najlepsze wyniki
- **Eksport**: PDF z brandingiem, Excel z surowymi danymi
- **Porównania**: vs poprzedni okres, benchmarki branżowe

### 5. Komunikacja (/client/messages)
- **Chat z Account Managerem**: bezpośredni kontakt z opiekunem konta
- **Powiadomienia systemowe**: nowe leady, ważne wydarzenia
- **Ogłoszenia**: informacje o nowych funkcjach, aktualizacjach
- **Szybkie akcje**: zamów raport, zgłoś lead, zaproponuj ulepszenie

### 6. Ustawienia (/client/settings)
- **Profil firmy**: podstawowe dane, logo, branding
- **Powiadomienia**: kiedy i o czym informować (email/SMS)
- **White-label branding**: dostosuj panel do swojej marki
- **Integracje**: webhook, API do własnego CRM, Zapier/Make.com

## 🔐 Konta testowe

### TechFlow Solutions
- **Email**: `techflow@bezhandlowca.pl`
- **Hasło**: `client2024`
- **Opis**: Firma technologiczna z pełnym dostępem do wszystkich funkcji

### ProBiznes Sp. z o.o.
- **Email**: `probiznes@bezhandlowca.pl`
- **Hasło**: `client2024`
- **Opis**: Konsulting biznesowy z pełnym dostępem do wszystkich funkcji

## 🚀 Funkcje specjalne

### "Tryb Podglądu"
Klient może zobaczyć dokładnie to, co widzi handlowiec (CRM, emaile, rozmowy) z opcją "przejmij kontrolę".

### "Quality Assurance"
- Losowe nagrania rozmów do oceny
- System gwiazdek + komentarz
- Feedbacki dla poprawy jakości

### "Briefing Center"
Miejsce gdzie klient może:
- Dodać nowe materiały (PDF, prezentacje)
- Zaktualizować FAQ dla handlowców
- Ogłosić zmiany w ofercie

### "Panic Button"
Natychmiastowe wstrzymanie wszystkich działań sprzedażowych (np. przy kryzysie PR).

## 🔧 Techniczne wymagania

### Multi-tenancy
- Każdy klient = osobny Google Sheets
- `clientId` w każdym requeście
- Middleware sprawdzający uprawnienia

### Real-time updates
- WebSocket/Server-Sent Events dla live feed
- Polling co 30 sekund jako fallback

### Bezpieczeństwo
- Szyfrowanie wrażliwych danych
- Audit log wszystkich akcji
- GDPR compliance (eksport/usunięcie danych)

### Mobile-first
- Responsive design dla wszystkich urządzeń
- PWA z powiadomieniami push
- Szybkie ładowanie <2s

## 📱 Przykładowy flow użytkownika

1. **Rano (08:00)**: Klient loguje się, widzi podsumowanie z wczoraj + plan na dziś
2. **09:15**: Dostaje powiadomienie o nowym leadzie wysokiej wartości
3. **09:16**: Klika i widzi, że Marta już dzwoni do klienta
4. **09:45**: Może odsłuchać nagranie po rozmowie i zobaczyć notatki
5. **10:00**: Widzi następne kroki zaplanowane przez handlowca
6. **18:00**: Otrzymuje automatyczny raport dzienny na email

## 🎨 UI/UX

### Design System
- Spójny z główną stroną BezHandlowca.pl
- Możliwość white-label rebrandingu
- Dark/light mode (opcjonalnie)

### Kolory
- Primary: #3B82F6 (blue-500)
- Success: #10B981 (green-500)
- Warning: #F59E0B (yellow-500)
- Error: #EF4444 (red-500)

### Ikony
- Emoji dla lepszej czytelności i przyjazności
- Lucide icons jako fallback

## 📊 Metryki sukcesu

### Dla klientów
- Zwiększenie konwersji o 15-30%
- Skrócenie cyklu sprzedaży o 20%
- Lepsza transparentność procesów

### Dla BezHandlowca.pl
- Zwiększenie retencji klientów
- Redukcja churn rate
- Wyższa satysfakcja klientów (NPS)

## 🔮 Przyszłe funkcje

### AI & Automatyzacja
- Predykcyjne scoring leadów
- Automatyczne przypisywanie do handlowców
- AI coaching dla handlowców

### Integracje
- Salesforce, HubSpot, Pipedrive
- Microsoft Teams, Slack
- Calendly, Google Calendar

### Advanced Analytics
- Heatmapy aktywności
- A/B testing scriptów
- Sentiment analysis rozmów

---

## 🏗️ Architektura techniczna

```
/client
├── layout.tsx          # ClientAuthProvider wrapper
├── login/
│   └── page.tsx       # Logowanie + 2FA
├── dashboard/
│   ├── layout.tsx     # Sidebar + navigation
│   └── page.tsx       # Main dashboard
├── leads/
│   └── page.tsx       # Podgląd leadów
├── team/
│   └── page.tsx       # Aktywność zespołu
├── reports/
│   └── page.tsx       # Raporty i analizy
├── messages/
│   └── page.tsx       # Komunikacja
├── settings/
│   └── page.tsx       # Ustawienia
└── README.md          # Ta dokumentacja
```

### Kluczowe pliki
- `useClientAuth.tsx` - Autoryzacja klientów
- `clientApi.ts` - API client z middleware
- Wspólne komponenty z panelem admin

---

*Panel Klienta to kompleksowe rozwiązanie dające pełną transparentność i kontrolę nad procesami sprzedażowymi w outsourcingu handlowym.* 