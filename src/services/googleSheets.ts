import { google } from 'googleapis';
import { config } from '@/lib/config';
import { formatTimestamp, sanitizeString } from '@/lib/utils';
import type { LeadFormData } from '@/types/form';

// Initialize Google Sheets client
function createSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: config.google.serviceAccountEmail,
      private_key: config.google.privateKey,
    },
    scopes: ['https://www.googleapis.com/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Sheet headers mapping
const SHEET_HEADERS = [
  'Data i godzina',
  'Imię',
  'Firma',
  'E-mail',
  'Telefon',
  'Wiadomość',
  'Źródło',
  'UTM Campaign',
  'UTM Source',
  'UTM Medium',
  'UTM Content',
  'Status',
  'Notatki',
];

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.sheets = createSheetsClient();
    this.spreadsheetId = config.google.sheetsId;
  }

  /**
   * Initialize the spreadsheet with headers if not exists
   */
  async initializeSheet(): Promise<void> {
    try {
      // Check if sheet exists and has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A1:M1',
      });

      if (!response.data.values || response.data.values.length === 0) {
        // Add headers if sheet is empty
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'Leads!A1:M1',
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [SHEET_HEADERS],
          },
        });

        // Format headers
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          resource: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: SHEET_HEADERS.length,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                      textFormat: {
                        foregroundColor: { red: 1, green: 1, blue: 1 },
                        bold: true,
                      },
                    },
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat)',
                },
              },
            ],
          },
        });
      }
    } catch (error) {
      console.error('Error initializing Google Sheet:', error);
      throw new Error('Failed to initialize Google Sheet');
    }
  }

  /**
   * Add a new lead to the spreadsheet
   */
  async addLead(formData: LeadFormData): Promise<{ success: boolean; rowId: number }> {
    try {
      await this.initializeSheet();

      const rowData = [
        formatTimestamp(),
        sanitizeString(formData.firstName),
        sanitizeString(formData.company),
        sanitizeString(formData.email),
        sanitizeString(formData.phone),
        sanitizeString(formData.message),
        formData.source || 'direct',
        formData.utm_campaign || '',
        formData.utm_source || '',
        formData.utm_medium || '',
        formData.utm_content || '',
        'new',
        '', // Notes - empty initially
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A:M',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData],
        },
      });

      // Extract row number from response
      const updatedRange = response.data.updates?.updatedRange;
      const rowId = updatedRange ? parseInt(updatedRange.split('!')[1].split(':')[0].replace(/\D/g, '')) : 0;

      // Format the newly added row
      if (rowId > 1) {
        await this.formatLeadRow(rowId);
      }

      return { success: true, rowId };
    } catch (error) {
      console.error('Error adding lead to Google Sheet:', error);
      throw new Error('Failed to save lead to Google Sheet');
    }
  }

  /**
   * Format a lead row for better readability
   */
  private async formatLeadRow(rowIndex: number): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowIndex - 1,
                  endRowIndex: rowIndex,
                  startColumnIndex: 0,
                  endColumnIndex: SHEET_HEADERS.length,
                },
                cell: {
                  userEnteredFormat: {
                    borders: {
                      bottom: { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
                    },
                  },
                },
                fields: 'userEnteredFormat.borders',
              },
            },
            // Highlight new leads
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowIndex - 1,
                  endRowIndex: rowIndex,
                  startColumnIndex: 11, // Status column
                  endColumnIndex: 12,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1, green: 0.9, blue: 0.6 },
                    textFormat: { bold: true },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error formatting lead row:', error);
      // Don't throw here as this is non-critical
    }
  }

  /**
   * Get lead statistics
   */
  async getLeadStats(): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    leadsThisMonth: number;
  }> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A:A',
      });

      const rows = response.data.values || [];
      const totalLeads = Math.max(0, rows.length - 1); // Subtract header row

      // Get today's date range
      const today = new Date();
      const todayStr = today.toLocaleDateString('pl-PL');
      
      // Get this week's start
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      
      // Get this month's start
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get all timestamps to calculate stats
      const timestampResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A2:A', // Skip header
      });

      const timestamps = timestampResponse.data.values?.flat() || [];
      
      let leadsToday = 0;
      let leadsThisWeek = 0;
      let leadsThisMonth = 0;

      timestamps.forEach((timestamp) => {
        if (!timestamp) return;
        
        const leadDate = new Date(timestamp);
        
        if (leadDate.toLocaleDateString('pl-PL') === todayStr) {
          leadsToday++;
        }
        
        if (leadDate >= thisWeekStart) {
          leadsThisWeek++;
        }
        
        if (leadDate >= thisMonthStart) {
          leadsThisMonth++;
        }
      });

      return {
        totalLeads,
        leadsToday,
        leadsThisWeek,
        leadsThisMonth,
      };
    } catch (error) {
      console.error('Error getting lead stats:', error);
      return {
        totalLeads: 0,
        leadsToday: 0,
        leadsThisWeek: 0,
        leadsThisMonth: 0,
      };
    }
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(rowId: number, status: string, notes?: string): Promise<void> {
    try {
      const updateValues: string[][] = [[status]];
      
      // Update status
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Leads!L${rowId}:L${rowId}`, // Status column
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: updateValues,
        },
      });

      // Update notes if provided
      if (notes) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `Leads!M${rowId}:M${rowId}`, // Notes column
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[notes]],
          },
        });
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw new Error('Failed to update lead status');
    }
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      return true;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService(); 