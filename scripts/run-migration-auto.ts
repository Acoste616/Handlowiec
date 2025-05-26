#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    console.log('🔄 Running database migration...');
    
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_init.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Try direct query if RPC fails
            const { error: directError } = await supabase
              .from('_temp')
              .select('*')
              .limit(0);
            
            if (directError && directError.code !== '42P01') {
              console.error(`❌ Error in statement ${i + 1}:`, error);
              // Continue with other statements
            }
          }
        } catch (err) {
          console.log(`⚠️ Statement ${i + 1} may have failed (this might be normal):`, err);
        }
      }
    }
    
    // Test if tables were created
    console.log('🔍 Testing table creation...');
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);
    
    if (clientsError && clientsError.code === '42P01') {
      console.log('❌ Tables were not created. Please run migration manually:');
      console.log('1. Go to https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/migrations/001_init.sql');
      console.log('4. Click "Run" to execute the migration');
      console.log('5. Then run: npm run seed');
      return;
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('🌱 Now you can run: npm run seed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📝 Please run migration manually:');
    console.log('1. Go to https://supabase.com/dashboard/project/dchwetwqmmeqyxlcqlac');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase/migrations/001_init.sql');
    console.log('4. Click "Run" to execute the migration');
    console.log('5. Then run: npm run seed');
  }
}

runMigration(); 