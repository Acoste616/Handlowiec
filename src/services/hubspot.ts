import { Client } from '@hubspot/api-client';
import { config } from '@/lib/config';
import { sanitizeString } from '@/lib/utils';
import type { LeadFormData } from '@/types/form';

interface HubSpotContactProperties {
  email: string;
  firstname: string;
  company: string;
  phone: string;
  message: string;
  lifecyclestage: string;
  lead_source: string;
  hs_lead_status: string;
  lead_source_detail: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  [key: string]: string | undefined;
}

interface HubSpotContact {
  id: string;
  properties?: {
    createdate?: string;
    [key: string]: string | undefined;
  };
}

export class HubSpotService {
  private client: Client;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!config.hubspot.accessToken;
    
    if (this.isEnabled) {
      this.client = new Client({ accessToken: config.hubspot.accessToken });
    }
  }

  /**
   * Create or update a contact in HubSpot
   */
  async createContact(formData: LeadFormData): Promise<{ success: boolean; contactId?: string }> {
    if (!this.isEnabled) {
      console.log('HubSpot integration disabled - no access token provided');
      return { success: true }; // Don't fail if HubSpot is not configured
    }

    try {
      // Prepare contact properties
      const properties: HubSpotContactProperties = {
        email: sanitizeString(formData.email),
        firstname: sanitizeString(formData.firstName),
        company: sanitizeString(formData.company),
        phone: sanitizeString(formData.phone),
        message: sanitizeString(formData.message),
        lifecyclestage: 'lead',
        lead_source: formData.source || 'website',
        hs_lead_status: 'NEW',
        lead_source_detail: 'Handlowiec.pl Landing Page',
      };

      // Add UTM parameters if available
      if (formData.utm_campaign) {
        properties.utm_campaign = formData.utm_campaign;
      }
      if (formData.utm_source) {
        properties.utm_source = formData.utm_source;
      }
      if (formData.utm_medium) {
        properties.utm_medium = formData.utm_medium;
      }
      if (formData.utm_content) {
        properties.utm_content = formData.utm_content;
      }

      // Create contact
      const response = await this.client.crm.contacts.basicApi.create({
        properties,
        associations: [],
      });

      // Create a deal associated with the contact
      await this.createDeal(response.id, formData);

      return { success: true, contactId: response.id };
    } catch (error: any) {
      console.error('Error creating HubSpot contact:', error);
      
      // If contact already exists, try to update it
      if (error.body?.category === 'CONFLICT') {
        try {
          return await this.updateContactByEmail(formData);
        } catch (updateError) {
          console.error('Error updating existing HubSpot contact:', updateError);
          throw new Error('Failed to create or update HubSpot contact');
        }
      }
      
      throw new Error('Failed to create HubSpot contact');
    }
  }

  /**
   * Update existing contact by email
   */
  private async updateContactByEmail(formData: LeadFormData): Promise<{ success: boolean; contactId?: string }> {
    try {
      // Search for contact by email
      const searchResponse = await this.client.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: formData.email,
              },
            ],
          },
        ],
        properties: ['email', 'firstname', 'company'],
      });

      if (searchResponse.results && searchResponse.results.length > 0) {
        const contactId = searchResponse.results[0].id;
        
        // Update contact with new information
        const properties = {
          firstname: sanitizeString(formData.firstName),
          company: sanitizeString(formData.company),
          phone: sanitizeString(formData.phone),
          message: sanitizeString(formData.message),
          lead_source: formData.source || 'website',
          hs_lead_status: 'NEW',
          last_form_submission: new Date().toISOString(),
        };

        await this.client.crm.contacts.basicApi.update(contactId, { properties });
        
        // Create a new deal for this submission
        await this.createDeal(contactId, formData);

        return { success: true, contactId };
      }
      
      throw new Error('Contact not found for update');
    } catch (error) {
      console.error('Error updating contact by email:', error);
      throw error;
    }
  }

  /**
   * Create a deal associated with the contact
   */
  private async createDeal(contactId: string, formData: LeadFormData): Promise<void> {
    try {
      const dealProperties = {
        dealname: `${formData.company} - Konsultacja Handlowiec`,
        dealstage: 'appointmentscheduled', // Adjust based on your HubSpot pipeline
        pipeline: 'default', // Adjust based on your HubSpot pipeline
        amount: '0', // To be determined during consultation
        deal_source: formData.source || 'website',
        deal_description: formData.message,
      };

      const dealResponse = await this.client.crm.deals.basicApi.create({
        properties: dealProperties,
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory: 'HUBSPOT_DEFINED',
                associationTypeId: 3, // Contact to Deal association
              },
            ],
          },
        ],
      });

      console.log('Deal created successfully:', dealResponse.id);
    } catch (error) {
      console.error('Error creating HubSpot deal:', error);
      // Don't throw here as the contact creation was successful
    }
  }

  /**
   * Create a note/activity for the contact
   */
  async createNote(contactId: string, noteContent: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.client.crm.objects.notes.basicApi.create({
        properties: {
          hs_note_body: noteContent,
          hs_timestamp: new Date().toISOString(),
        },
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory: 'HUBSPOT_DEFINED',
                associationTypeId: 202, // Note to Contact association
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error creating HubSpot note:', error);
      // Don't throw as this is supplementary
    }
  }

  /**
   * Get contact analytics
   */
  async getContactStats(): Promise<{
    totalContacts: number;
    newContactsToday: number;
    newContactsThisWeek: number;
    newContactsThisMonth: number;
  }> {
    if (!this.isEnabled) {
      return {
        totalContacts: 0,
        newContactsToday: 0,
        newContactsThisWeek: 0,
        newContactsThisMonth: 0,
      };
    }

    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get total contacts with lead source = website
      const totalResponse = await this.client.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'lead_source',
                operator: 'EQ',
                value: 'website',
              },
            ],
          },
        ],
        properties: ['createdate'],
        limit: 100,
      });

      const contacts = totalResponse.results || [];
      const totalContacts = contacts.length;

      // Filter by date ranges
      const newContactsToday = contacts.filter((contact: HubSpotContact) => {
        const createDate = new Date(contact.properties?.createdate || '');
        return createDate >= todayStart;
      }).length;

      const newContactsThisWeek = contacts.filter((contact: HubSpotContact) => {
        const createDate = new Date(contact.properties?.createdate || '');
        return createDate >= weekStart;
      }).length;

      const newContactsThisMonth = contacts.filter((contact: HubSpotContact) => {
        const createDate = new Date(contact.properties?.createdate || '');
        return createDate >= monthStart;
      }).length;

      return {
        totalContacts,
        newContactsToday,
        newContactsThisWeek,
        newContactsThisMonth,
      };
    } catch (error) {
      console.error('Error getting HubSpot contact stats:', error);
      return {
        totalContacts: 0,
        newContactsToday: 0,
        newContactsThisWeek: 0,
        newContactsThisMonth: 0,
      };
    }
  }

  /**
   * Test HubSpot connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isEnabled) return false;

    try {
      await this.client.crm.contacts.basicApi.getPage(1);
      return true;
    } catch (error) {
      console.error('HubSpot connection test failed:', error);
      return false;
    }
  }

  /**
   * Check if HubSpot integration is enabled
   */
  isIntegrationEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const hubspotService = new HubSpotService(); 