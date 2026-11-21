const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const { Lead } = require('./models/Lead');
const connectDB = require('./config/db');

const sampleLeads = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1-555-0199',
    company: 'Cyberdyne Systems',
    source: 'Website',
    status: 'New',
  },
  {
    name: 'Arthur Dent',
    email: 'arthur.dent@galaxyguide.org',
    phone: '+44-20-7946-0912',
    company: 'Megadodo Publications',
    source: 'Referral',
    status: 'Contacted',
  },
  {
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    phone: '+1-212-970-4133',
    company: 'Stark Industries',
    source: 'LinkedIn',
    status: 'Qualified',
  },
  {
    name: 'Bruce Wayne',
    email: 'bruce@wayneenterprises.com',
    phone: '+1-201-555-0143',
    company: 'Wayne Enterprises',
    source: 'Cold Call',
    status: 'Qualified',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@novatech.co',
    phone: '+49-30-12345678',
    company: 'NovaTech Solutions',
    source: 'Website',
    status: 'New',
  },
  {
    name: 'Miles Morales',
    email: 'miles@brooklynvisions.edu',
    phone: '+1-718-555-0182',
    company: 'Visions Academy',
    source: 'Referral',
    status: 'Contacted',
  },
  {
    name: 'Diana Prince',
    email: 'diana@themyscira-arts.org',
    phone: '+1-202-555-0177',
    company: 'Gateway Cultural Trust',
    source: 'LinkedIn',
    status: 'Qualified',
  },
  {
    name: 'Peter Parker',
    email: 'peter@dailybugle.net',
    phone: '+1-212-555-0198',
    company: 'Daily Bugle Media',
    source: 'Email Campaign',
    status: 'Lost',
  },
  {
    name: 'Natasha Romanoff',
    email: 'natasha@shield-intel.gov',
    phone: '+1-202-555-0199',
    company: 'SHIELD Operations',
    source: 'Referral',
    status: 'Contacted',
  },
  {
    name: 'Walter White',
    email: 'walter@graymattertech.com',
    phone: '+1-505-555-0125',
    company: 'Gray Matter Technologies',
    source: 'Cold Call',
    status: 'Lost',
  },
  {
    name: 'Sherlock Holmes',
    email: 'sherlock@bakerstreet.co.uk',
    phone: '+44-20-7224-3688',
    company: 'Consulting Detectives Ltd',
    source: 'Website',
    status: 'New',
  },
  {
    name: 'James Holden',
    email: 'holden@roci-logistics.com',
    phone: '+1-415-555-0164',
    company: 'Rocinante Logistics',
    source: 'LinkedIn',
    status: 'Qualified',
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Lead.deleteMany({});
    console.log('[Seeder] Existing leads cleared.');

    const createdLeads = await Lead.insertMany(sampleLeads);
    console.log(`[Seeder] Successfully imported ${createdLeads.length} sample leads!`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to import sample data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Lead.deleteMany({});
    console.log('[Seeder] All leads destroyed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to destroy data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
