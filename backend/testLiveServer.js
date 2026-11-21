const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const request = require('supertest');

async function verifyLiveServer() {
  console.log('=== STARTING COMPLETE VERIFICATION OF FULL-STACK LEAD MANAGER ===\n');

  try {
    // 1. Verify Database Connection
    console.log('[Step 1/7] Connecting to Database...');
    await connectDB();
    console.log('[PASS] MongoDB Connection established.\n');

    // 2. Health Endpoint Verification
    console.log('[Step 2/7] Verifying /api/health endpoint...');
    const healthRes = await request(app).get('/api/health');
    console.log(`Health Response: Status=${healthRes.statusCode}, Database=${healthRes.body.database}`);
    if (healthRes.statusCode !== 200 || healthRes.body.database !== 'connected') {
      throw new Error('Health check failed: database not connected');
    }
    console.log('[PASS] Health check verified.\n');

    // 3. Compulsory Feature 1 & 2: List Leads & Display
    console.log('[Step 3/7] Verifying GET /api/leads (List Leads)...');
    const listRes = await request(app).get('/api/leads');
    console.log(`List Response: Status=${listRes.statusCode}, Count=${listRes.body.count}, Total=${listRes.body.total}`);
    if (listRes.statusCode !== 200 || !Array.isArray(listRes.body.data)) {
      throw new Error('Failed to retrieve leads list');
    }
    console.log('[PASS] Listing leads verified.\n');

    // 4. Compulsory Feature 1 & 6: Add Lead & Validation
    console.log('[Step 4/7] Testing Lead Creation and Validation...');
    // 4a. Invalid Lead (missing name and invalid email)
    const invalidRes = await request(app).post('/api/leads').send({
      email: 'not-an-email',
      company: 'Test Corp',
    });
    if (invalidRes.statusCode !== 400 || !invalidRes.body.errors) {
      throw new Error('Backend validation failed to reject invalid payload');
    }
    console.log('[PASS] Backend input validation successfully rejected invalid lead with 400 Bad Request.');

    // 4b. Valid Lead Creation
    const newLeadPayload = {
      name: 'Verification Lead',
      email: 'verify@merutech.com',
      phone: '+1 800 555 0199',
      company: 'Meru Screening Inc',
      source: 'LinkedIn',
      status: 'New',
    };
    const createRes = await request(app).post('/api/leads').send(newLeadPayload);
    if (createRes.statusCode !== 201 || !createRes.body.data._id) {
      throw new Error('Failed to create new lead');
    }
    const createdId = createRes.body.data._id;
    console.log(`[PASS] Lead created successfully with MongoDB ObjectId: ${createdId}\n`);

    // 5. Compulsory Feature 5: Search & Filter Verification
    console.log('[Step 5/7] Testing Search by Name and Filter by Status...');
    const searchRes = await request(app).get('/api/leads?search=Verification');
    if (searchRes.statusCode !== 200 || searchRes.body.data.length === 0) {
      throw new Error('Search by name failed to find created lead');
    }
    console.log(`[PASS] Search by name successfully found ${searchRes.body.data.length} match.`);

    const filterRes = await request(app).get('/api/leads?status=New');
    if (filterRes.statusCode !== 200) {
      throw new Error('Filter by status failed');
    }
    console.log(`[PASS] Filter by status="New" returned ${filterRes.body.data.length} leads.\n`);

    // 6. Compulsory Feature 3 & 4: Edit Lead & Delete Lead with Confirmation
    console.log('[Step 6/7] Testing Lead Update and Deletion...');
    // 6a. Update Lead Status
    const updateRes = await request(app).put(`/api/leads/${createdId}`).send({
      status: 'Qualified',
      company: 'Meru Screening Inc (Updated)',
    });
    if (updateRes.statusCode !== 200 || updateRes.body.data.status !== 'Qualified') {
      throw new Error('Failed to update lead status');
    }
    console.log('[PASS] Lead status updated to "Qualified".');

    // 6b. Delete Lead
    const deleteRes = await request(app).delete(`/api/leads/${createdId}`);
    if (deleteRes.statusCode !== 200 || !deleteRes.body.success) {
      throw new Error('Failed to delete lead');
    }
    console.log('[PASS] Lead deleted successfully.');

    // 6c. Verify Record is Gone
    const getDeletedRes = await request(app).get(`/api/leads/${createdId}`);
    if (getDeletedRes.statusCode !== 404) {
      throw new Error('Deleted lead still exists');
    }
    console.log('[PASS] Confirmed deleted lead is no longer in MongoDB (404 Not Found).\n');

    // 7. Verify Stats and Pagination
    console.log('[Step 7/7] Testing Dashboard Stats & Pagination...');
    const statsRes = await request(app).get('/api/leads/stats');
    if (statsRes.statusCode !== 200 || typeof statsRes.body.data.total !== 'number') {
      throw new Error('Failed to fetch dashboard stats');
    }
    console.log(`[PASS] Dashboard Stats: Total=${statsRes.body.data.total}, New=${statsRes.body.data.new}, Contacted=${statsRes.body.data.contacted}, Qualified=${statsRes.body.data.qualified}, Lost=${statsRes.body.data.lost}`);

    const pageRes = await request(app).get('/api/leads?page=1&limit=2');
    if (pageRes.statusCode !== 200 || pageRes.body.count > 2) {
      throw new Error('Pagination limit failed');
    }
    console.log(`[PASS] Pagination verified: requested limit=2, returned count=${pageRes.body.count}, totalPages=${pageRes.body.totalPages}`);

    console.log('\n======================================================');
    console.log('🎉 ALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ VERIFICATION FAILED: ${error.message}`);
    process.exit(1);
  }
}

verifyLiveServer();
