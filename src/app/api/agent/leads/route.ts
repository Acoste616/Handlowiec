import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface NewLeadData {
  firstName: string;
  lastName: string;
  company: string;
  position?: string;
  email: string;
  phone: string;
  website?: string;
  industry?: string;
  companySize?: string;
  status: 'new' | 'contacted' | 'qualified';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'referral' | 'cold_call' | 'event' | 'linkedin' | 'google_ads' | 'facebook' | 'other';
  estimatedValue?: number;
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  tags?: string[];
  agentId: string;
}

interface LeadResponse {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  position?: string;
  email: string;
  phone: string;
  website?: string;
  industry?: string;
  companySize?: string;
  status: string;
  priority: string;
  source: string;
  estimatedValue?: number;
  notes?: string;
  nextAction?: string;
  nextActionDate?: string;
  tags?: string[];
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

// Walidacja danych wejściowych
function validateLeadData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Wymagane pola
  if (!data.firstName?.trim()) {
    errors.push('Imię jest wymagane');
  }
  if (!data.lastName?.trim()) {
    errors.push('Nazwisko jest wymagane');
  }
  if (!data.company?.trim()) {
    errors.push('Nazwa firmy jest wymagana');
  }
  if (!data.email?.trim()) {
    errors.push('Email jest wymagany');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Nieprawidłowy format email');
  }
  if (!data.phone?.trim()) {
    errors.push('Telefon jest wymagany');
  }

  // Walidacja statusu
  const validStatuses = ['new', 'contacted', 'qualified'];
  if (!validStatuses.includes(data.status)) {
    errors.push('Nieprawidłowy status');
  }

  // Walidacja priorytetu
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(data.priority)) {
    errors.push('Nieprawidłowy priorytet');
  }

  // Walidacja źródła
  const validSources = ['website', 'referral', 'cold_call', 'event', 'linkedin', 'google_ads', 'facebook', 'other'];
  if (!validSources.includes(data.source)) {
    errors.push('Nieprawidłowe źródło');
  }

  // Walidacja wartości szacunkowej
  if (data.estimatedValue !== undefined && data.estimatedValue !== null) {
    if (isNaN(Number(data.estimatedValue)) || Number(data.estimatedValue) < 0) {
      errors.push('Wartość szacunkowa musi być liczbą większą lub równą 0');
    }
  }

  // Walidacja daty następnej akcji
  if (data.nextActionDate && new Date(data.nextActionDate) < new Date()) {
    errors.push('Data następnej akcji nie może być w przeszłości');
  }

  // Walidacja URL strony internetowej
  if (data.website && data.website.trim()) {
    try {
      new URL(data.website);
    } catch {
      errors.push('Nieprawidłowy format URL strony internetowej');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Generowanie unikalnego ID (w produkcji używałbyś UUID lub ID z bazy danych)
function generateLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST - Dodawanie nowego leada
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Pobierz ID agenta z nagłówków (w produkcji z sesji/tokenu)
    const agentId = request.headers.get('X-Agent-ID') || 'agent_default';
    
    // Przygotuj dane leada
    const leadData: NewLeadData = {
      ...body,
      agentId,
      estimatedValue: body.estimatedValue ? Number(body.estimatedValue) : undefined
    };

    // Walidacja danych
    const validation = validateLeadData(leadData);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Błędy walidacji',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Sprawdź czy lead z tym emailem już istnieje (symulacja)
    const existingLeadCheck = await checkExistingLead(leadData.email);
    if (existingLeadCheck.exists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Lead z tym adresem email już istnieje',
          existingLeadId: existingLeadCheck.leadId
        },
        { status: 409 }
      );
    }

    // Stwórz nowego leada (symulacja zapisu do bazy danych)
    const newLead: LeadResponse = {
      id: generateLeadId(),
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      company: leadData.company,
      position: leadData.position,
      email: leadData.email,
      phone: leadData.phone,
      website: leadData.website,
      industry: leadData.industry,
      companySize: leadData.companySize,
      status: leadData.status,
      priority: leadData.priority,
      source: leadData.source,
      estimatedValue: leadData.estimatedValue,
      notes: leadData.notes,
      nextAction: leadData.nextAction,
      nextActionDate: leadData.nextActionDate,
      tags: leadData.tags || [],
      agentId: leadData.agentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // W produkcji tutaj byłaby zapis do bazy danych (Supabase)
    /*
    const { data, error } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single();

    if (error) {
      throw error;
    }
    */

    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Log dla celów debugowania
    console.log('Nowy lead dodany:', {
      id: newLead.id,
      name: `${newLead.firstName} ${newLead.lastName}`,
      company: newLead.company,
      email: newLead.email,
      agentId: newLead.agentId
    });

    // Zwróć sukces
    return NextResponse.json({
      success: true,
      message: 'Lead został pomyślnie dodany',
      data: newLead
    }, { status: 201 });

  } catch (error) {
    console.error('Błąd podczas dodawania leada:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wystąpił błąd serwera podczas dodawania leada' 
      },
      { status: 500 }
    );
  }
}

// GET - Pobieranie leadów agenta
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = request.headers.get('X-Agent-ID') || 'agent_default';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Symulacja danych leadów
    const mockLeads: LeadResponse[] = [
      {
        id: 'lead_1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        company: 'TechCorp Sp. z o.o.',
        position: 'CTO',
        email: 'jan.kowalski@techcorp.pl',
        phone: '+48 123 456 789',
        website: 'https://techcorp.pl',
        industry: 'IT/Software',
        companySize: '51-200 pracowników',
        status: 'qualified',
        priority: 'high',
        source: 'website',
        estimatedValue: 85000,
        notes: 'Zainteresowany systemem CRM dla 50 pracowników',
        nextAction: 'Przygotowanie oferty',
        nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tags: ['CRM', 'Enterprise', 'Hot Lead'],
        agentId: agentId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'lead_2',
        firstName: 'Anna',
        lastName: 'Nowak',
        company: 'ProSoft Solutions',
        position: 'CEO',
        email: 'anna.nowak@prosoft.pl',
        phone: '+48 987 654 321',
        website: 'https://prosoft.pl',
        industry: 'IT/Software',
        companySize: '11-50 pracowników',
        status: 'contacted',
        priority: 'medium',
        source: 'linkedin',
        estimatedValue: 45000,
        notes: 'Potrzebuje rozwiązania do automatyzacji sprzedaży',
        nextAction: 'Follow-up call',
        nextActionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        tags: ['Automation', 'SMB'],
        agentId: agentId,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];

    // Filtrowanie (symulacja)
    let filteredLeads = mockLeads.filter(lead => lead.agentId === agentId);

    if (status && status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }

    if (priority && priority !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead => 
        lead.firstName.toLowerCase().includes(searchLower) ||
        lead.lastName.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      );
    }

    // Paginacja
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedLeads,
      pagination: {
        page,
        limit,
        total: filteredLeads.length,
        totalPages: Math.ceil(filteredLeads.length / limit)
      }
    });

  } catch (error) {
    console.error('Błąd podczas pobierania leadów:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Wystąpił błąd podczas pobierania leadów' 
      },
      { status: 500 }
    );
  }
}

// Funkcja pomocnicza do sprawdzania istniejących leadów
async function checkExistingLead(email: string): Promise<{ exists: boolean; leadId?: string }> {
  // W produkcji tutaj byłoby zapytanie do bazy danych
  /*
  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email)
    .single();

  return {
    exists: !error && data !== null,
    leadId: data?.id
  };
  */

  // Symulacja sprawdzenia
  const existingEmails = [
    'existing@example.com',
    'duplicate@test.pl'
  ];

  const exists = existingEmails.includes(email.toLowerCase());
  
  return {
    exists,
    leadId: exists ? 'existing_lead_id' : undefined
  };
} 