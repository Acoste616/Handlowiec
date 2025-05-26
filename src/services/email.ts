import nodemailer from 'nodemailer';
import { config } from '@/config/index';
import { formatTimestamp, getEstimatedResponseTime } from '@/lib/utils';
import type { LeadFormData } from '@/types/form';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // Use secure for port 465
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Send lead notification email to the founder
   */
  async sendLeadNotification(formData: LeadFormData): Promise<void> {
    const subject = `🚨 Nowy lead z bezhandlowca.pl - ${formData.company}`;
    
    const html = this.generateLeadNotificationHTML(formData);
    const text = this.generateLeadNotificationText(formData);

    try {
      await this.transporter.sendMail({
        from: `"BezHandlowca.pl" <${config.email.from}>`,
        to: config.email.from, // Send to the same address as from
        subject,
        html,
        text,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
        },
      });
    } catch (error) {
      console.error('Error sending lead notification email:', error);
      throw new Error('Failed to send lead notification email');
    }
  }

  /**
   * Send confirmation email to the lead
   */
  async sendLeadConfirmation(formData: LeadFormData): Promise<void> {
    const subject = 'Dziękujemy za zainteresowanie - BezHandlowca.pl';
    
    const html = this.generateConfirmationHTML(formData);
    const text = this.generateConfirmationText(formData);

    try {
      await this.transporter.sendMail({
        from: `"Bartek z BezHandlowca.pl" <${config.email.from}>`,
        to: formData.email,
        subject,
        html,
        text,
        replyTo: config.email.from,
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't throw here as this is not critical for the lead submission
    }
  }

  /**
   * Send case study email to the lead
   */
  async sendCaseStudy(formData: LeadFormData): Promise<void> {
    const subject = '📊 Twoje case study: 6× więcej leadów w 90 dni - BezHandlowca.pl';
    
    const html = this.generateCaseStudyHTML(formData);
    const text = this.generateCaseStudyText(formData);

    try {
      await this.transporter.sendMail({
        from: `"Bartek z BezHandlowca.pl" <${config.email.from}>`,
        to: formData.email,
        subject,
        html,
        text,
        replyTo: config.email.from,
        priority: 'high',
      });
    } catch (error) {
      console.error('Error sending case study email:', error);
      throw new Error('Failed to send case study email');
    }
  }

  /**
   * Generate HTML for lead notification email
   */
  private generateLeadNotificationHTML(formData: LeadFormData): string {
    const utmParams = [
      formData.utm_source && `📍 Źródło: ${formData.utm_source}`,
      formData.utm_medium && `📊 Medium: ${formData.utm_medium}`,
      formData.utm_campaign && `🎯 Kampania: ${formData.utm_campaign}`,
      formData.utm_content && `📝 Treść: ${formData.utm_content}`,
    ].filter(Boolean).join('<br>');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nowy lead - BezHandlowca.pl</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #004aa3 0%, #f97316 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .lead-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #374151; margin-bottom: 5px; }
          .value { background: #f3f4f6; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; }
          .message { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; }
          .actions { background: #004aa3; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .btn { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px; }
          .utm-info { background: #e0f2fe; padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 14px; }
          .priority { background: #fecaca; border: 1px solid #f87171; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-weight: 600; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Nowy Lead z BezHandlowca.pl</h1>
            <p>Data: ${formatTimestamp()}</p>
          </div>
          
          <div class="content">
            <div class="priority">
              ⏰ PRIORYTET: Oddzwoń w ciągu 15 minut dla maksymalnej konwersji!
            </div>
            
            <div class="lead-info">
              <h2>📋 Informacje o kliencie</h2>
              
              <div class="field">
                <div class="label">👤 Imię:</div>
                <div class="value">${formData.firstName}</div>
              </div>
              
              <div class="field">
                <div class="label">🏢 Firma:</div>
                <div class="value">${formData.company}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 E-mail:</div>
                <div class="value">
                  <a href="mailto:${formData.email}">${formData.email}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">📞 Telefon:</div>
                <div class="value">
                  <a href="tel:${formData.phone}">${formData.phone}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="label">💬 Wiadomość:</div>
                <div class="message">${formData.message}</div>
              </div>
            </div>
            
            ${utmParams ? `
              <div class="utm-info">
                <h3>📊 Dane trackingowe</h3>
                ${utmParams}
              </div>
            ` : ''}
            
            <div class="actions">
              <h3>🎯 Natychmiastowe działania</h3>
              <p>Zalecane kroki w ciągu 15 minut:</p>
              <a href="tel:${formData.phone}" class="btn">📞 Zadzwoń teraz</a>
              <a href="mailto:${formData.email}" class="btn">📧 Wyślij e-mail</a>
              <a href="https://bezhandlowca.pl/admin" class="btn">📊 Dashboard</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for lead notification email
   */
  private generateLeadNotificationText(formData: LeadFormData): string {
    return `
NOWY LEAD Z BEZHANDLOWCA.PL
========================

🚨 PILNE: Oddzwoń w ciągu 15 minut!

Data: ${formatTimestamp()}

DANE KLIENTA:
- Imię: ${formData.firstName}
- Firma: ${formData.company}
- E-mail: ${formData.email}
- Telefon: ${formData.phone}

WIADOMOŚĆ:
${formData.message}

${formData.utm_source ? `ŹRÓDŁO: ${formData.utm_source}` : ''}
${formData.utm_campaign ? `KAMPANIA: ${formData.utm_campaign}` : ''}

DZIAŁANIA:
1. Zadzwoń: ${formData.phone}
2. E-mail: ${formData.email}
3. Dashboard: https://bezhandlowca.pl/admin

Powodzenia!
Team BezHandlowca.pl
    `.trim();
  }

  /**
   * Generate HTML for confirmation email to lead
   */
  private generateConfirmationHTML(formData: LeadFormData): string {
    const responseTime = getEstimatedResponseTime();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dziękujemy za zainteresowanie - BezHandlowca.pl</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #004aa3 0%, #f97316 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0; }
          .next-steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .step { margin-bottom: 15px; padding: 15px; background: #f3f4f6; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; font-size: 14px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Dziękujemy ${formData.firstName}!</h1>
            <p>Twoja wiadomość dotarła do nas bezpiecznie</p>
          </div>
          
          <div class="content">
            <div class="highlight">
              <h2>⏰ Odezwiemy się ${responseTime}</h2>
              <p>Twoje zgłoszenie zostało przekazane bezpośrednio do Bartka, założyciela BezHandlowca.pl. Dzięki temu otrzymasz odpowiedź od osoby, która najlepiej zna nasze możliwości.</p>
            </div>
            
            <div class="next-steps">
              <h3>🚀 Co dzieje się teraz?</h3>
              
              <div class="step">
                <strong>1. Analiza potrzeb (do ${responseTime})</strong><br>
                Przeanalizujemy Twoją wiadomość i przygotujemy spersonalizowane rozwiązanie dla ${formData.company}.
              </div>
              
              <div class="step">
                <strong>2. Bezpłatna konsultacja (15 minut)</strong><br>
                Porozmawiamy o Twoich największych wyzwaniach w sprzedaży i pokażemy, jak możemy pomóc.
              </div>
              
              <div class="step">
                <strong>3. Propozycja współpracy</strong><br>
                Jeśli zdecydujemy, że możemy Ci pomóc, przedstawimy konkretny plan działania.
              </div>
            </div>
            
            <div class="highlight">
              <h3>💡 W międzyczasie...</h3>
              <p>Przygotuj się do rozmowy, zastanawiając się nad:</p>
              <ul>
                <li>Aktualnym stanem Twojego lejka sprzedażowego</li>
                <li>Największymi wyzwaniami w pozyskiwaniu klientów</li>
                <li>Celami, które chciałbyś osiągnąć w następnych 3-6 miesiącach</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>
                <strong>Bartek Kowalski</strong><br>
                Założyciel BezHandlowca.pl<br>
                📧 bartek@bezhandlowca.pl<br>
                📞 +48 123 456 789
              </p>
              
              <p style="margin-top: 20px;">
                <strong>BezHandlowca Sp. z o.o.</strong><br>
                ul. Przykładowa 123, 00-001 Warszawa<br>
                NIP: 123-456-78-90
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for confirmation email
   */
  private generateConfirmationText(formData: LeadFormData): string {
    const responseTime = getEstimatedResponseTime();
    
    return `
Dziękujemy ${formData.firstName}!

Twoja wiadomość dotarła do nas bezpiecznie i zostanie przekazana bezpośrednio do Bartka, założyciela BezHandlowca.pl.

ODEZWIEMY SIĘ: ${responseTime}

CO DZIEJE SIĘ TERAZ?
1. Analiza potrzeb (do ${responseTime})
   - Przeanalizujemy Twoją wiadomość
   - Przygotujemy spersonalizowane rozwiązanie dla ${formData.company}

2. Bezpłatna konsultacja (15 minut)
   - Porozmawiamy o wyzwaniach w sprzedaży
   - Pokażemy, jak możemy pomóc

3. Propozycja współpracy
   - Przedstawimy konkretny plan działania

W MIĘDZYCZASIE przygotuj się do rozmowy:
- Aktualny stan lejka sprzedażowego
- Największe wyzwania w pozyskiwaniu klientów  
- Cele na następne 3-6 miesięcy

---
Bartek Kowalski
Założyciel BezHandlowca.pl
bartek@bezhandlowca.pl
+48 123 456 789

BezHandlowca Sp. z o.o.
ul. Przykładowa 123, 00-001 Warszawa
NIP: 123-456-78-90
    `.trim();
  }

  /**
   * Generate HTML for case study email
   */
  private generateCaseStudyHTML(formData: LeadFormData): string {
    const caseStudyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bezhandlowca.pl'}/downloads/case-study-6x-wiecej-leadow.html`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Twoje case study - BezHandlowca.pl</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #004aa3 0%, #f97316 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0; }
          .case-study-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
          .stat { text-align: center; padding: 15px; background: #f3f4f6; border-radius: 6px; }
          .stat-number { font-size: 24px; font-weight: bold; color: #10b981; display: block; }
          .btn { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 14px; color: #6b7280; }
          .next-steps { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Twoje case study jest gotowe!</h1>
            <p>Cześć ${formData.firstName}, jak obiecaliśmy - oto konkretne liczby</p>
          </div>
          
          <div class="content">
            <div class="case-study-box">
              <h2>🎯 Case Study: 6× więcej leadów w 90 dni</h2>
              <p><strong>Jak firma IT TechFlow zwiększyła liczbę leadów z 20 do 120/miesiąc</strong></p>
              
              <div class="stats">
                <div class="stat">
                  <span class="stat-number">6×</span>
                  <div>Więcej leadów</div>
                </div>
                <div class="stat">
                  <span class="stat-number">90</span>
                  <div>Dni implementacji</div>
                </div>
                <div class="stat">
                  <span class="stat-number">45%</span>
                  <div>Redukcja kosztów</div>
                </div>
                <div class="stat">
                  <span class="stat-number">320%</span>
                  <div>ROI w 6 miesięcy</div>
                </div>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${caseStudyUrl}" class="btn">📥 Pobierz pełne case study</a>
              </div>
              
              <p><strong>Co znajdziesz w case study:</strong></p>
              <ul>
                <li>✅ Dokładny 90-dniowy plan implementacji</li>
                <li>✅ Konkretne narzędzia i ich koszty</li>
                <li>✅ Strategie dla każdego kanału pozyskiwania</li>
                <li>✅ Błędy, których należy unikać</li>
                <li>✅ Szczegółową analizę ROI</li>
              </ul>
            </div>
            
            <div class="highlight">
              <h3>💡 Czy podobne rezultaty są możliwe w ${formData.company}?</h3>
              <p>Każda firma jest inna, ale zasady pozostają te same. Jeśli chcesz omówić, jak zastosować te strategie w Twojej branży, umów się na bezpłatną 15-minutową konsultację.</p>
            </div>
            
            <div class="next-steps">
              <h3>🚀 Następne kroki</h3>
              <p>Po przeczytaniu case study, jeśli chcesz omówić implementację w ${formData.company}:</p>
              <ol>
                <li>Przeczytaj case study (5-10 minut)</li>
                <li>Zastanów się nad swoimi celami</li>
                <li>Umów się na bezpłatną konsultację</li>
              </ol>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://bezhandlowca.pl/kontakt" class="btn">📞 Umów konsultację</a>
              </div>
            </div>
            
            <div class="footer">
              <p>
                <strong>Bartek Kowalski</strong><br>
                Założyciel BezHandlowca.pl<br>
                📧 bartek@bezhandlowca.pl<br>
                📞 +48 123 456 789
              </p>
              
              <p style="margin-top: 15px; font-size: 12px;">
                PS: Case study zostało przygotowane na podstawie rzeczywistego projektu.<br>
                Wszystkie liczby są prawdziwe, zmieniliśmy tylko nazwę firmy.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for case study email
   */
  private generateCaseStudyText(formData: LeadFormData): string {
    const caseStudyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bezhandlowca.pl'}/downloads/case-study-6x-wiecej-leadow.html`;
    
    return `
📊 Twoje case study jest gotowe!

Cześć ${formData.firstName},

Jak obiecaliśmy - oto konkretne liczby i strategie, które pomogły firmie IT zwiększyć liczbę leadów z 20 do 120/miesiąc w 90 dni.

GŁÓWNE REZULTATY:
✅ 6× więcej leadów
✅ 90 dni implementacji  
✅ 45% redukcja kosztów
✅ 320% ROI w 6 miesięcy

POBIERZ CASE STUDY:
${caseStudyUrl}

CO ZNAJDZIESZ W CASE STUDY:
- Dokładny 90-dniowy plan implementacji
- Konkretne narzędzia i ich koszty
- Strategie dla każdego kanału pozyskiwania
- Błędy, których należy unikać
- Szczegółową analizę ROI

CZY PODOBNE REZULTATY SĄ MOŻLIWE W ${formData.company.toUpperCase()}?

Każda firma jest inna, ale zasady pozostają te same. Jeśli chcesz omówić, jak zastosować te strategie w Twojej branży, umów się na bezpłatną 15-minutową konsultację.

NASTĘPNE KROKI:
1. Przeczytaj case study (5-10 minut)
2. Zastanów się nad swoimi celami  
3. Umów się na bezpłatną konsultację: https://bezhandlowca.pl/kontakt

---
Bartek Kowalski
Założyciel BezHandlowca.pl
bartek@bezhandlowca.pl
+48 123 456 789

PS: Case study zostało przygotowane na podstawie rzeczywistego projektu. Wszystkie liczby są prawdziwe, zmieniliśmy tylko nazwę firmy.
    `.trim();
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService(); 