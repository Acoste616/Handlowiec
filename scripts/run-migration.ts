import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    console.log('🔄 Checking database connection...');
    
    // Test connection by checking if clients table exists
    const { data, error: testError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);
    
    if (testError) {
      if (testError.code === '42P01') {
        console.log('📝 Tables do not exist yet. Please run the migration manually:');
        console.log('1. Go to https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the contents of supabase/migrations/001_init.sql');
        console.log('4. Click "Run" to execute the migration');
        console.log('5. Then run: npm run seed');
        return;
      } else {
        console.error('❌ Connection failed:', testError);
        return;
      }
    }
    
    console.log('✅ Connected to Supabase successfully');
    console.log('✅ Tables already exist - ready to seed data!');
    console.log('🌱 Run: npm run seed');
    
  } catch (error) {
    console.error('❌ Migration check failed:', error);
  }
}

runMigration(); 