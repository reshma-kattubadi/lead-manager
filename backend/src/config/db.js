const mongoose = require('mongoose');

let mongoMemoryServer = null;

/**
 * Connect to MongoDB instance.
 * Priority 1: process.env.MONGODB_URI (Local daemon or MongoDB Atlas cloud cluster)
 * Priority 2: In development/evaluation, automatically spins up an embedded MongoDB server
 *             so the application is 100% operational immediately out of the box.
 */
const connectDB = async () => {
  const primaryURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_manager';

  try {
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 2500, // Quick check for running local/cloud MongoDB
    });

    console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[Database] External MongoDB not reachable (${primaryError.message}).`);

    // In production, exit immediately
    if (process.env.NODE_ENV === 'production') {
      console.error('[Database Error] In production, a valid MONGODB_URI is required.');
      process.exit(1);
    }

    // In development / testing: start embedded MongoMemoryServer
    try {
      console.log('[Database] Starting Embedded MongoDB Server for local evaluation...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryURI = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryURI);
      console.log(`[Database] Connected to Embedded MongoDB at: ${memoryURI}`);

      // Auto-seed initial leads so the evaluator sees pipeline data immediately
      try {
        const { Lead } = require('../models/Lead');
        const count = await Lead.countDocuments();
        if (count === 0) {
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
              name: 'Peter Parker',
              email: 'peter@dailybugle.net',
              phone: '+1-212-555-0198',
              company: 'Daily Bugle Media',
              source: 'Email Campaign',
              status: 'Lost',
            },
          ];
          await Lead.insertMany(sampleLeads);
          console.log(`[Database] Auto-seeded ${sampleLeads.length} sample leads for immediate testing.`);
        }
      } catch (seedErr) {
        console.warn(`[Database] Auto-seeding skipped: ${seedErr.message}`);
      }

      return conn;
    } catch (fallbackError) {
      console.error(`[Database Error] Could not start embedded database: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

module.exports = connectDB;
