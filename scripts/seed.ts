import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker/locale/pl';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seed() {
  console.log('🌱 Starting seed process...');

  try {
    // Create test clients
    console.log('Creating test clients...');
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert([
        { 
          name: 'TechFlow Solutions', 
          domain: 'techflow.pl',
          settings: {
            timezone: 'Europe/Warsaw',
            currency: 'PLN',
            working_hours: { start: '09:00', end: '17:00' }
          }
        },
        { 
          name: 'ProBiznes Sp. z o.o.', 
          domain: 'probiznes.pl',
          settings: {
            timezone: 'Europe/Warsaw',
            currency: 'PLN',
            working_hours: { start: '08:00', end: '16:00' }
          }
        },
        { 
          name: 'InnovateCorp', 
          domain: 'innovate.pl',
          settings: {
            timezone: 'Europe/Warsaw',
            currency: 'PLN',
            working_hours: { start: '10:00', end: '18:00' }
          }
        },
      ])
      .select();

    if (clientsError) {
      throw new Error(`Failed to create clients: ${clientsError.message}`);
    }

    console.log(`✅ Created ${clients?.length} clients`);

    // Create test users for each client
    console.log('Creating test users...');
    const users = [];
    
    for (const client of clients!) {
      // Create 3-5 users per client
      const userCount = faker.number.int({ min: 3, max: 5 });
      
      for (let i = 0; i < userCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${client.domain}`;
        
        users.push({
          id: faker.string.uuid(),
          email,
          full_name: `${firstName} ${lastName}`,
          client_id: client.id,
          role: i === 0 ? 'admin' : faker.helpers.arrayElement(['agent', 'manager']),
        });
      }
    }

    const { error: usersError } = await supabase
      .from('users')
      .insert(users);

    if (usersError) {
      throw new Error(`Failed to create users: ${usersError.message}`);
    }

    console.log(`✅ Created ${users.length} users`);

    // Create test leads for each client
    console.log('Creating test leads...');
    let totalLeads = 0;

    for (const client of clients!) {
      // Get users for this client
      const { data: clientUsers } = await supabase
        .from('users')
        .select('id')
        .eq('client_id', client.id);

      const userIds = clientUsers?.map(u => u.id) || [];
      
      // Create 30-80 leads per client
      const leadCount = faker.number.int({ min: 30, max: 80 });
      const leads = [];

      for (let i = 0; i < leadCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const company = faker.company.name();
        const status = faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost']);
        const priority = faker.helpers.arrayElement(['low', 'medium', 'high']);
        
        leads.push({
          client_id: client.id,
          first_name: firstName,
          last_name: lastName,
          company,
          email: faker.internet.email({ firstName, lastName }),
          phone: faker.helpers.maybe(() => faker.phone.number('+48 ### ### ###'), { probability: 0.8 }),
          status,
          priority,
          assigned_to: faker.helpers.maybe(() => faker.helpers.arrayElement(userIds), { probability: 0.7 }),
          estimated_value: faker.helpers.maybe(() => faker.number.int({ min: 5000, max: 500000 }), { probability: 0.6 }),
          closing_probability: status === 'closed' ? 100 : 
                              status === 'lost' ? 0 : 
                              faker.number.int({ min: 10, max: 90 }),
          source: faker.helpers.arrayElement(['website', 'referral', 'cold_call', 'linkedin', 'email_campaign', 'trade_show']),
          notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.4 }),
          timeline: [
            {
              id: faker.string.uuid(),
              timestamp: faker.date.recent({ days: 30 }).toISOString(),
              type: 'note',
              description: 'Lead created',
              agentName: 'System',
            },
          ],
        });
      }

      const { error: leadsError } = await supabase
        .from('leads')
        .insert(leads);

      if (leadsError) {
        throw new Error(`Failed to create leads for ${client.name}: ${leadsError.message}`);
      }

      totalLeads += leads.length;
      console.log(`✅ Created ${leads.length} leads for ${client.name}`);
    }

    // Create some activities for leads
    console.log('Creating activities...');
    const { data: allLeads } = await supabase
      .from('leads')
      .select('id, client_id')
      .limit(100); // Sample some leads

    if (allLeads) {
      const activities = [];
      
      for (const lead of allLeads) {
        // Create 1-5 activities per lead
        const activityCount = faker.number.int({ min: 1, max: 5 });
        
        for (let i = 0; i < activityCount; i++) {
          const type = faker.helpers.arrayElement(['call', 'email', 'meeting', 'note']);
          
          activities.push({
            lead_id: lead.id,
            type,
            description: getActivityDescription(type),
            metadata: {
              duration: type === 'call' || type === 'meeting' ? faker.number.int({ min: 5, max: 60 }) : undefined,
              subject: type === 'email' ? faker.lorem.sentence() : undefined,
            },
            created_at: faker.date.recent({ days: 14 }).toISOString(),
          });
        }
      }

      const { error: activitiesError } = await supabase
        .from('activities')
        .insert(activities);

      if (activitiesError) {
        console.warn(`Warning: Failed to create some activities: ${activitiesError.message}`);
      } else {
        console.log(`✅ Created ${activities.length} activities`);
      }
    }

    // Create team rotations
    console.log('Creating team rotations...');
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, client_id')
      .eq('role', 'agent');

    if (allUsers) {
      const rotations = [];
      
      for (const user of allUsers) {
        // Create 30-day rotation
        const start30 = faker.date.recent({ days: 30 });
        const end30 = new Date(start30);
        end30.setDate(end30.getDate() + 30);
        
        rotations.push({
          client_id: user.client_id,
          user_id: user.id,
          rotation_type: '30_days',
          start_date: start30.toISOString().split('T')[0],
          end_date: end30.toISOString().split('T')[0],
          is_active: faker.datatype.boolean(),
        });

        // Maybe create 90-day rotation
        if (faker.datatype.boolean()) {
          const start90 = faker.date.recent({ days: 90 });
          const end90 = new Date(start90);
          end90.setDate(end90.getDate() + 90);
          
          rotations.push({
            client_id: user.client_id,
            user_id: user.id,
            rotation_type: '90_days',
            start_date: start90.toISOString().split('T')[0],
            end_date: end90.toISOString().split('T')[0],
            is_active: faker.datatype.boolean(),
          });
        }
      }

      const { error: rotationsError } = await supabase
        .from('team_rotations')
        .insert(rotations);

      if (rotationsError) {
        console.warn(`Warning: Failed to create rotations: ${rotationsError.message}`);
      } else {
        console.log(`✅ Created ${rotations.length} team rotations`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Clients: ${clients?.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Leads: ${totalLeads}`);
    console.log(`   - Activities: Created for sample leads`);
    console.log(`   - Team rotations: Created for agents`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

function getActivityDescription(type: string): string {
  switch (type) {
    case 'call':
      return faker.helpers.arrayElement([
        'Rozmowa telefoniczna - omówienie potrzeb',
        'Połączenie zwrotne po prezentacji',
        'Krótka rozmowa o budżecie',
        'Ustalenie terminu spotkania',
        'Rozmowa z decydentem',
      ]);
    case 'email':
      return faker.helpers.arrayElement([
        'Wysłano ofertę handlową',
        'Przesłano dodatkowe materiały',
        'Follow-up po spotkaniu',
        'Odpowiedź na pytania klienta',
        'Zaproszenie na prezentację',
      ]);
    case 'meeting':
      return faker.helpers.arrayElement([
        'Spotkanie w biurze klienta',
        'Prezentacja online',
        'Spotkanie networkingowe',
        'Wizyta w naszym biurze',
        'Spotkanie na targach',
      ]);
    case 'note':
      return faker.helpers.arrayElement([
        'Klient zainteresowany rozwiązaniem',
        'Wymaga dodatkowych informacji',
        'Decyzja przełożona na przyszły miesiąc',
        'Pozytywny feedback po prezentacji',
        'Klient porównuje z konkurencją',
      ]);
    default:
      return faker.lorem.sentence();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch(console.error);
}

export default seed; 