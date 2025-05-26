import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  assignedTo?: string;
  estimatedValue?: number;
  closingProbability: number;
  lastContact?: string;
  nextAction?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.headers.get('X-Client-ID');
    const { searchParams } = new URL(request.url);

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID required' },
        { status: 400 }
      );
    }

    // For now, return mock data. In production, this would query Supabase
    const mockLeads: Lead[] = [
      {
        id: '1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        company: 'TechCorp Sp. z o.o.',
        email: 'jan.kowalski@techcorp.pl',
        phone: '+48 123 456 789',
        status: 'contacted',
        priority: 'high',
        source: 'website',
        assignedTo: 'Bartek Nowak',
        estimatedValue: 85000,
        closingProbability: 75,
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        nextAction: 'Prezentacja produktu w przyszłym tygodniu',
        notes: 'Bardzo zainteresowany, ma budżet. CEO podejmuje decyzje szybko.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Nowak',
        company: 'ProSoft Solutions',
        email: 'anna.nowak@prosoft.pl',
        phone: '+48 987 654 321',
        status: 'new',
        priority: 'medium',
        source: 'linkedin',
        assignedTo: 'Marta Kowalska',
        estimatedValue: 45000,
        closingProbability: 30,
        nextAction: 'Pierwszy kontakt telefoniczny',
        notes: 'Lead z LinkedIn, potrzebuje więcej informacji o usłudze.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        company: 'DataFlow Ltd.',
        email: 'piotr.wisniewski@dataflow.com',
        phone: '+48 555 777 888',
        status: 'qualified',
        priority: 'high',
        source: 'referral',
        assignedTo: 'Tomasz Wiśniewski',
        estimatedValue: 120000,
        closingProbability: 85,
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        nextAction: 'Przygotowanie propozycji handlowej',
        notes: 'Qualified lead, gotowy na propozycję. Budżet potwierdzony.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        firstName: 'Maria',
        lastName: 'Kowalczyk',
        company: 'InnoTech Sp. z o.o.',
        email: 'maria.kowalczyk@innotech.pl',
        phone: '+48 666 888 999',
        status: 'proposal',
        priority: 'high',
        source: 'google_ads',
        assignedTo: 'Bartek Nowak',
        estimatedValue: 95000,
        closingProbability: 60,
        lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        nextAction: 'Oczekiwanie na decyzję zarządu',
        notes: 'Propozycja wysłana, pozytywne sygnały od zespołu technicznego.',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        firstName: 'Tomasz',
        lastName: 'Zieliński',
        company: 'GreenTech Solutions',
        email: 'tomasz.zielinski@greentech.pl',
        phone: '+48 444 555 666',
        status: 'closed',
        priority: 'medium',
        source: 'website',
        assignedTo: 'Marta Kowalska',
        estimatedValue: 75000,
        closingProbability: 100,
        lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        nextAction: 'Onboarding klienta',
        notes: 'Deal zamknięty! Umowa podpisana na 12 miesięcy.',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        firstName: 'Katarzyna',
        lastName: 'Lewandowska',
        company: 'FinanceFlow Sp. z o.o.',
        email: 'katarzyna.lewandowska@financeflow.pl',
        phone: '+48 333 222 111',
        status: 'lost',
        priority: 'low',
        source: 'cold_call',
        assignedTo: 'Tomasz Wiśniewski',
        estimatedValue: 35000,
        closingProbability: 0,
        lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        nextAction: 'Brak dalszych działań',
        notes: 'Zdecydowali się na konkurencyjne rozwiązanie. Możliwy kontakt za 6 miesięcy.',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    // Apply filters if provided
    let filteredLeads = mockLeads;
    
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('agent');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    if (status && status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }
    if (priority && priority !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
    }
    if (assignedTo && assignedTo !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.assignedTo === assignedTo);
    }
    if (source && source !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.source === source);
    }
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm) ||
        lead.lastName.toLowerCase().includes(searchTerm) ||
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm)
      );
    }

    // If Supabase is configured, you could fetch real data here
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          // Example of real data fetching (commented out for now)
          /*
          const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('client_id', clientId);

          if (!error && leads) {
            // Process and return real data
            return NextResponse.json({
              success: true,
              data: { leads: leads }
            });
          }
          */
        } catch (error) {
          console.error('Error fetching real leads:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        leads: filteredLeads,
        total: filteredLeads.length,
        filters: {
          status,
          priority,
          assignedTo,
          source,
          search
        }
      }
    });

  } catch (error) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 