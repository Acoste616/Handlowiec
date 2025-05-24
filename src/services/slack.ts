import axios from 'axios';
import { config } from '@/lib/config';
import { formatTimestamp } from '@/lib/utils';
import type { LeadFormData } from '@/types/form';

export class SlackService {
  private webhookUrl: string;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = config.slack.webhookUrl;
    this.isEnabled = !!this.webhookUrl;
  }

  /**
   * Send new lead notification to Slack
   */
  async sendLeadNotification(formData: LeadFormData): Promise<void> {
    if (!this.isEnabled) {
      console.log('Slack integration disabled - no webhook URL provided');
      return;
    }

    try {
      const message = this.formatLeadMessage(formData);
      
      await axios.post(this.webhookUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      // Don't throw here as this is not critical for the lead submission
    }
  }

  /**
   * Format lead data for Slack message
   */
  private formatLeadMessage(formData: LeadFormData): any {
    const utmFields = [];
    
    if (formData.utm_source) {
      utmFields.push({
        title: 'Źródło',
        value: formData.utm_source,
        short: true,
      });
    }
    
    if (formData.utm_campaign) {
      utmFields.push({
        title: 'Kampania',
        value: formData.utm_campaign,
        short: true,
      });
    }
    
    if (formData.utm_medium) {
      utmFields.push({
        title: 'Medium',
        value: formData.utm_medium,
        short: true,
      });
    }

    return {
      username: 'BezHandlowca Bot',
      icon_emoji: ':fire:',
      text: '🚨 *NOWY LEAD Z BEZHANDLOWCA.PL* 🚨',
      attachments: [
        {
          color: '#f97316',
          title: `Nowe zgłoszenie od ${formData.company}`,
          title_link: 'https://bezhandlowca.pl/admin',
          fields: [
            {
              title: 'Imię',
              value: formData.firstName,
              short: true,
            },
            {
              title: 'Firma',
              value: formData.company,
              short: true,
            },
            {
              title: 'E-mail',
              value: `<mailto:${formData.email}|${formData.email}>`,
              short: true,
            },
            {
              title: 'Telefon',
              value: `<tel:${formData.phone}|${formData.phone}>`,
              short: true,
            },
            {
              title: 'Wiadomość',
              value: formData.message,
              short: false,
            },
            ...utmFields,
          ],
          footer: 'BezHandlowca.pl',
          footer_icon: 'https://bezhandlowca.pl/favicon.ico',
          ts: Math.floor(Date.now() / 1000),
        },
        {
          color: '#004aa3',
          title: '⏰ Natychmiastowe działania',
          text: 'Zadzwoń w ciągu 15 minut dla maksymalnej konwersji!',
          actions: [
            {
              type: 'button',
              text: '📞 Zadzwoń',
              url: `tel:${formData.phone}`,
              style: 'primary',
            },
            {
              type: 'button',
              text: '📧 E-mail',
              url: `mailto:${formData.email}`,
            },
            {
              type: 'button',
              text: '📊 Dashboard',
              url: 'https://bezhandlowca.pl/admin',
            },
          ],
        },
      ],
    };
  }

  /**
   * Send daily summary to Slack
   */
  async sendDailySummary(stats: {
    leadsToday: number;
    totalLeads: number;
    topSources: Array<{ source: string; count: number }>;
  }): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const message = {
        username: 'BezHandlowca Bot',
        icon_emoji: ':chart_with_upwards_trend:',
        text: '📊 *DZIENNY RAPORT LEADÓW*',
        attachments: [
          {
            color: stats.leadsToday > 0 ? '#10b981' : '#6b7280',
            fields: [
              {
                title: 'Leady dzisiaj',
                value: stats.leadsToday.toString(),
                short: true,
              },
              {
                title: 'Leady łącznie',
                value: stats.totalLeads.toString(),
                short: true,
              },
              {
                title: 'Top źródła',
                value: stats.topSources
                  .slice(0, 3)
                  .map(s => `${s.source}: ${s.count}`)
                  .join('\n') || 'Brak danych',
                short: false,
              },
            ],
            footer: `Raport z ${formatTimestamp()}`,
          },
        ],
      };

      await axios.post(this.webhookUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
    } catch (error) {
      console.error('Error sending Slack daily summary:', error);
    }
  }

  /**
   * Send error notification to Slack
   */
  async sendErrorNotification(error: string, context?: any): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const message = {
        username: 'BezHandlowca Bot',
        icon_emoji: ':warning:',
        text: '🚨 *BŁĄD W SYSTEMIE BEZHANDLOWCA.PL*',
        attachments: [
          {
            color: '#ef4444',
            fields: [
              {
                title: 'Opis błędu',
                value: error,
                short: false,
              },
              {
                title: 'Kontekst',
                value: context ? JSON.stringify(context, null, 2) : 'Brak dodatkowych informacji',
                short: false,
              },
              {
                title: 'Czas wystąpienia',
                value: formatTimestamp(),
                short: true,
              },
            ],
          },
        ],
      };

      await axios.post(this.webhookUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
    } catch (slackError) {
      console.error('Error sending Slack error notification:', slackError);
    }
  }

  /**
   * Send weekly summary to Slack
   */
  async sendWeeklySummary(stats: {
    leadsThisWeek: number;
    totalLeads: number;
    conversionRate: number;
    topCompanies: Array<{ company: string; count: number }>;
  }): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const message = {
        username: 'BezHandlowca Bot',
        icon_emoji: ':calendar:',
        text: '📈 *TYGODNIOWY RAPORT LEADÓW*',
        attachments: [
          {
            color: '#004aa3',
            fields: [
              {
                title: 'Leady w tym tygodniu',
                value: stats.leadsThisWeek.toString(),
                short: true,
              },
              {
                title: 'Współczynnik konwersji',
                value: `${stats.conversionRate.toFixed(1)}%`,
                short: true,
              },
              {
                title: 'Top firmy',
                value: stats.topCompanies
                  .slice(0, 5)
                  .map(c => `${c.company}: ${c.count}`)
                  .join('\n') || 'Brak danych',
                short: false,
              },
            ],
            footer: `Raport tygodniowy z ${formatTimestamp()}`,
          },
        ],
      };

      await axios.post(this.webhookUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
    } catch (error) {
      console.error('Error sending Slack weekly summary:', error);
    }
  }

  /**
   * Test Slack connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      const testMessage = {
        username: 'BezHandlowca Bot',
        icon_emoji: ':white_check_mark:',
        text: '✅ Test połączenia Slack - wszystko działa!',
        attachments: [
          {
            color: '#10b981',
            text: `Test przeprowadzony: ${formatTimestamp()}`,
          },
        ],
      };

      await axios.post(this.webhookUrl, testMessage, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      return true;
    } catch (error) {
      console.error('Slack connection test failed:', error);
      return false;
    }
  }

  /**
   * Check if Slack integration is enabled
   */
  isIntegrationEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const slackService = new SlackService(); 