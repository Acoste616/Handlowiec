import { config } from '@/lib/config';
import { sanitizeString } from '@/utils';
import type { LeadFormData } from '@/types/form';

export class HubSpotService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!config.hubspot.accessToken;
  }

  async createContact(formData: LeadFormData): Promise<{ success: boolean; contactId?: string }> {
    // Temporarily disabled - return success without doing anything
    console.log('HubSpot integration temporarily disabled');
    return { success: true };
  }

  async createNote(contactId: string, noteContent: string): Promise<void> {
    // Temporarily disabled
    console.log('HubSpot note creation temporarily disabled');
  }

  async getContactStats(): Promise<{
    totalContacts: number;
    newContactsToday: number;
    newContactsThisWeek: number;
    newContactsThisMonth: number;
  }> {
    // Return mock data
    return {
      totalContacts: 0,
      newContactsToday: 0,
      newContactsThisWeek: 0,
      newContactsThisMonth: 0,
    };
  }

  async testConnection(): Promise<boolean> {
    // Mock connection test
    return this.isEnabled;
  }

  isIntegrationEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const hubspotService = new HubSpotService(); 