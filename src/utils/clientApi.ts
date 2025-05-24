interface ClientApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ClientApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/client';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get client session info
    const clientUser = localStorage.getItem('client_user');
    const clientData = clientUser ? JSON.parse(clientUser) : null;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add client authentication headers
    if (clientData) {
      defaultHeaders['X-Client-ID'] = clientData.companyId;
      defaultHeaders['X-Client-User'] = clientData.email;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          localStorage.removeItem('client_user');
          localStorage.removeItem('client_session_expiry');
          window.location.href = '/client/login';
          throw new Error('Session expired');
        }
        
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ClientApiResponse<any>> {
    return this.request('/dashboard/stats');
  }

  async getActivityFeed(): Promise<ClientApiResponse<any>> {
    return this.request('/dashboard/activity');
  }

  async getActiveAgents(): Promise<ClientApiResponse<any>> {
    return this.request('/dashboard/agents');
  }

  // Leads endpoints
  async getLeads(params?: {
    status?: string;
    agent?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ClientApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getLeadDetails(leadId: string): Promise<ClientApiResponse<any>> {
    return this.request(`/leads/${leadId}`);
  }

  async updateLeadPriority(leadId: string, priority: string): Promise<ClientApiResponse<any>> {
    return this.request(`/leads/${leadId}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority })
    });
  }

  async requestJoinCall(leadId: string, message?: string): Promise<ClientApiResponse<any>> {
    return this.request(`/leads/${leadId}/join-call`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // Team endpoints
  async getTeamMembers(): Promise<ClientApiResponse<any>> {
    return this.request('/team');
  }

  async getAgentActivity(agentId: string, date?: string): Promise<ClientApiResponse<any>> {
    const endpoint = `/team/${agentId}/activity${date ? `?date=${date}` : ''}`;
    return this.request(endpoint);
  }

  async requestScreenShare(agentId: string): Promise<ClientApiResponse<any>> {
    return this.request(`/team/${agentId}/screen-share`, {
      method: 'POST'
    });
  }

  // Reports endpoints
  async getReports(params?: {
    dateRange?: string;
    type?: string;
  }): Promise<ClientApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async exportReport(format: 'pdf' | 'excel', reportType: string): Promise<ClientApiResponse<any>> {
    return this.request(`/reports/export`, {
      method: 'POST',
      body: JSON.stringify({ format, reportType })
    });
  }

  // Messages endpoints
  async getMessages(): Promise<ClientApiResponse<any>> {
    return this.request('/messages');
  }

  async sendMessage(to: string, subject: string, content: string): Promise<ClientApiResponse<any>> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ to, subject, content })
    });
  }

  async markMessageRead(messageId: string): Promise<ClientApiResponse<any>> {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PATCH'
    });
  }

  // Settings endpoints
  async getSettings(): Promise<ClientApiResponse<any>> {
    return this.request('/settings');
  }

  async updateSettings(settings: any): Promise<ClientApiResponse<any>> {
    return this.request('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    });
  }

  async updateBranding(branding: any): Promise<ClientApiResponse<any>> {
    return this.request('/settings/branding', {
      method: 'PATCH',
      body: JSON.stringify(branding)
    });
  }

  async testWebhook(webhookUrl: string): Promise<ClientApiResponse<any>> {
    return this.request('/settings/webhook/test', {
      method: 'POST',
      body: JSON.stringify({ webhookUrl })
    });
  }

  // Special functions
  async triggerPanicButton(reason: string): Promise<ClientApiResponse<any>> {
    return this.request('/panic', {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async submitQualityFeedback(callId: string, rating: number, feedback: string): Promise<ClientApiResponse<any>> {
    return this.request('/quality/feedback', {
      method: 'POST',
      body: JSON.stringify({ callId, rating, feedback })
    });
  }

  async uploadBriefingMaterial(file: File, type: string): Promise<ClientApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/briefing/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Remove content-type to let browser set it for FormData
    });
  }
}

export const clientApiClient = new ClientApiClient(); 