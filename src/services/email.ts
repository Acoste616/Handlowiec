import nodemailer from 'nodemailer';
import { config } from '@/lib/config';
import { formatTimestamp, getEstimatedResponseTime } from '@/lib/utils';
import type { LeadFormData } from '@/types/form';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
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
    const subject = `🚨 Nowy lead z handlowiec.pl - ${formData.company}`;
    
    const html = this.generateLeadNotificationHTML(formData);
    const text = this.generateLeadNotificationText(formData);

    try {
      await this.transporter.sendMail({
        from: `"Handlowiec.pl" <${config.email.from}>`,
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
    const subject = 'Dziękujemy za zainteresowanie - Handlowiec.pl';
    
    const html = this.generateConfirmationHTML(formData);
    const text = this.generateConfirmationText(formData);

    try {
      await this.transporter.sendMail({
        from: `"Bartek z Handlowiec.pl" <${config.email.from}>`,
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
        <title>Nowy lead - Handlowiec.pl</title>
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
            <h1>🚨 Nowy Lead z Handlowiec.pl</h1>
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
              <a href="https://handlowiec.pl/admin" class="btn">📊 Dashboard</a>
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
NOWY LEAD Z HANDLOWIEC.PL
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
3. Dashboard: https://handlowiec.pl/admin

Powodzenia!
Team Handlowiec.pl
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
        <title>Dziękujemy za zainteresowanie - Handlowiec.pl</title>
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
              <p>Twoje zgłoszenie zostało przekazane bezpośrednio do Bartka, założyciela Handlowiec.pl. Dzięki temu otrzymasz odpowiedź od osoby, która najlepiej zna nasze możliwości.</p>
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
                Założyciel Handlowiec.pl<br>
                📧 bartek@handlowiec.pl<br>
                📞 +48 123 456 789
              </p>
              
              <p style="margin-top: 20px;">
                <strong>Handlowiec Sp. z o.o.</strong><br>
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

Twoja wiadomość dotarła do nas bezpiecznie i zostanie przekazana bezpośrednio do Bartka, założyciela Handlowiec.pl.

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
Założyciel Handlowiec.pl
bartek@handlowiec.pl
+48 123 456 789

Handlowiec Sp. z o.o.
ul. Przykładowa 123, 00-001 Warszawa
NIP: 123-456-78-90
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