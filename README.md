# 🚀 BezHandlowca.pl MVP - Landing Page

## 📋 Project Overview

Professional B2B sales outsourcing landing page for Polish SME market. Built with Next.js 14, TypeScript, and Tailwind CSS.

**Target**: Polish CEOs and sales directors in 10-100 employee companies (IT/SaaS/tech)
**Goal**: Generate ≥10 qualified leads in 30 days

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS modules
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Google Analytics 4, LinkedIn Pixel, Hotjar
- **Integrations**: Google Sheets, HubSpot, Email, Slack
- **Deployment**: Vercel (production), Docker (development)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/bezhandlowca-mvp.git
cd bezhandlowca-mvp
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

4. **Required environment variables**
```env
# Google Sheets (Critical)
GOOGLE_SHEETS_ID=your_sheets_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email (Critical)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

5. **Run development server**
```bash
npm run dev
```

6. **Open application**
Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── leads/         # Lead processing endpoint
│   │   └── health/        # Health check
│   ├── privacy/           # Privacy policy page
│   ├── thank-you/         # Success page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── sections/         # Page sections
│   ├── layout/           # Layout components
│   └── analytics/        # Tracking components
├── lib/                   # Shared utilities
├── services/             # External integrations
├── types/                # TypeScript types
├── utils/                # Helper functions
├── validation/           # Zod schemas
└── config/               # Configuration
```

## 🔧 Configuration

### Google Sheets Setup

1. Create Google Sheet with headers:
   - timestamp, firstName, company, email, phone, message, source, utm_campaign, utm_source, utm_medium, utm_content, status, notes

2. Create service account:
   - Google Cloud Console → IAM & Admin → Service Accounts
   - Create new service account
   - Generate JSON key
   - Share sheet with service account email

### Email Setup

For Gmail with app passwords:
1. Enable 2FA on Gmail account
2. Generate app password
3. Use app password in SMTP_PASSWORD

### Analytics Setup

- **Google Analytics**: Create GA4 property, get Measurement ID
- **LinkedIn Pixel**: Create pixel in LinkedIn Campaign Manager
- **Hotjar**: Create site in Hotjar dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository**
```bash
npm install -g vercel
vercel
```

2. **Add environment variables** in Vercel dashboard

3. **Deploy**
```bash
vercel --prod
```

### Docker

1. **Build image**
```bash
docker build -t bezhandlowca-mvp .
```

2. **Run container**
```bash
docker run -p 3000:3000 --env-file .env.local bezhandlowca-mvp
```

### Docker Compose (Development)

```bash
docker-compose up -d
```

## 📊 Features

### ✅ Implemented

- **Lead Management**: Form → Google Sheets → Email notifications
- **Analytics**: GA4, LinkedIn Pixel, Hotjar tracking
- **Integrations**: HubSpot CRM, Slack notifications
- **Security**: Rate limiting, input sanitization, CSRF protection
- **SEO**: Structured data, meta tags, Polish localization
- **Performance**: Image optimization, code splitting
- **Accessibility**: WCAG 2.1 AA compliance

### 🔧 Technical Features

- **TypeScript**: Full type safety with strict mode
- **Form Validation**: Polish phone/email validation with Zod
- **Error Handling**: Comprehensive error boundaries and logging
- **Rate Limiting**: IP-based throttling (5 requests/15min)
- **Monitoring**: Health checks and error tracking
- **Caching**: Strategic caching for performance

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📈 Analytics Events

- `page_view` - Page visits
- `lead_form_submit` - Form submissions
- `cta_click` - CTA button clicks
- `scroll_depth` - Scroll tracking
- `file_download` - Resource downloads

## 🔒 Security

- **HTTPS**: Enforced in production
- **Headers**: Security headers via Vercel
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Prevents spam and abuse
- **GDPR**: Compliant privacy policy and consent

## 🌍 Polish Market Optimizations

- **Language**: Native Polish content and UX
- **Validation**: Polish phone number format (NIP validation ready)
- **Business Hours**: Warsaw timezone awareness
- **Legal**: GDPR-compliant privacy policy
- **Currency**: PLN formatting for pricing
- **Contact**: Polish business communication style

## 📞 Support

- **Email**: tech@bezhandlowca.pl
- **Phone**: +48 123 456 789
- **Issues**: GitHub Issues

## 📝 License

MIT License - see LICENSE.md

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 🔄 Development Workflow

```bash
# Start development
npm run dev

# Check code quality
npm run lint
npm run type-check

# Format code
npm run format

# Test changes
npm test

# Build for production
npm run build
```

## 🎯 Business Goals

- **Primary**: Generate 10+ qualified leads in 30 days
- **Secondary**: Establish brand presence in Polish B2B market
- **Performance**: <2s load time, >90 Lighthouse score
- **Conversion**: >5% form completion rate

## 📊 KPIs

- Lead form submissions
- Email signup rate
- Page engagement time
- Bounce rate (<40%)
- Core Web Vitals (all green)

---

**Built with ❤️ for Polish SME market** 