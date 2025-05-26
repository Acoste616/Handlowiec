#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function createDefaultClient() {
  console.log('🔧 Creating default client for website leads...');

  try {
    // Check if default client already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id, name')
      .eq('domain', 'bezhandlowca.pl')
      .single();

    if (existingClient) {
      console.log('✅ Default client already exists:', existingClient.name);
      return;
    }

    // Create default client for website leads
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name: 'Leady z formularza',
        domain: 'bezhandlowca.pl',
        settings: {
          timezone: 'Europe/Warsaw',
          currency: 'PLN',
          working_hours: { start: '09:00', end: '17:00' },
          lead_scoring: {
            enabled: true,
            weights: {
              budget: 30,
              timeline: 20,
              company_size: 25,
              decision_maker: 15,
              pain_points: 10
            }
          }
        },
        subscription_plan: 'enterprise'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create default client: ${error.message}`);
    }

    console.log('✅ Created default client:', client.name);

    // Create default admin user for this client
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        email: 'admin@bezhandlowca.pl',
        full_name: 'Administrator',
        client_id: client.id,
        role: 'admin'
      })
      .select()
      .single();

    if (userError) {
      console.warn('Warning: Failed to create admin user:', userError.message);
    } else {
      console.log('✅ Created admin user:', user.email);
    }

    console.log('🎉 Default client setup completed!');

  } catch (error) {
    console.error('❌ Failed to create default client:', error);
    
    // Check if it's a table not found error
    if (error instanceof Error && error.message.includes('relation "clients" does not exist')) {
      console.log('\n📝 Tables do not exist. Please run the migration first:');
      console.log('1. Go to https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/migrations/001_init.sql');
      console.log('4. Click "Run" to execute the migration');
      console.log('5. Then run this script again: npx tsx scripts/create-default-client.ts');
    }
  }
}

createDefaultClient(); 