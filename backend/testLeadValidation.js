const { Lead, LEAD_SOURCES, LEAD_STATUSES } = require('./src/models/Lead');
const { validateCreateLead, validateUpdateLead } = require('./src/middleware/validateLead');

function mockResponse() {
  const res = {};
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
}

function runTests() {
  console.log('[Test Suite] Running Backend Validation & Schema Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Test Model Schema Definitions
  assert(LEAD_SOURCES.includes('Website'), 'Lead sources include "Website"');
  assert(LEAD_SOURCES.includes('LinkedIn'), 'Lead sources include "LinkedIn"');
  assert(LEAD_STATUSES.includes('New'), 'Lead statuses include "New"');
  assert(LEAD_STATUSES.includes('Contacted'), 'Lead statuses include "Contacted"');
  assert(LEAD_STATUSES.includes('Qualified'), 'Lead statuses include "Qualified"');
  assert(LEAD_STATUSES.includes('Lost'), 'Lead statuses include "Lost"');

  // 2. Test Mongoose Model validation for empty document
  const emptyLead = new Lead({});
  const valError = emptyLead.validateSync();
  assert(valError !== undefined, 'Mongoose catches empty document as invalid');
  assert(valError.errors['name'] !== undefined, 'Mongoose catches missing "name"');
  assert(valError.errors['email'] !== undefined, 'Mongoose catches missing "email"');
  assert(valError.errors['phone'] !== undefined, 'Mongoose catches missing "phone"');
  assert(valError.errors['company'] !== undefined, 'Mongoose catches missing "company"');
  assert(valError.errors['source'] !== undefined, 'Mongoose catches missing "source"');

  // 3. Test Invalid Email in Schema
  const invalidEmailLead = new Lead({
    name: 'Alice Smith',
    email: 'not-an-email',
    phone: '1234567890',
    company: 'TechCorp',
    source: 'Website',
    status: 'New',
  });
  const emailErr = invalidEmailLead.validateSync();
  assert(emailErr && emailErr.errors['email'] !== undefined, 'Mongoose catches invalid email format ("not-an-email")');

  // 4. Test Invalid Status in Schema
  const invalidStatusLead = new Lead({
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '1234567890',
    company: 'TechCorp',
    source: 'Website',
    status: 'UnknownStatus',
  });
  const statusErr = invalidStatusLead.validateSync();
  assert(statusErr && statusErr.errors['status'] !== undefined, 'Mongoose catches invalid status ("UnknownStatus")');

  // 5. Test Valid Lead in Schema
  const validLead = new Lead({
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+1-555-123-4567',
    company: 'TechCorp',
    source: 'LinkedIn',
    status: 'New',
  });
  const validErr = validLead.validateSync();
  assert(!validErr, 'Valid lead passes Mongoose schema validation without errors');

  // 6. Test validateCreateLead Middleware with Missing Fields
  const req1 = { body: {} };
  const res1 = mockResponse();
  let nextCalled1 = false;
  validateCreateLead(req1, res1, () => { nextCalled1 = true; });
  assert(res1.statusCode === 400, 'Middleware rejects empty payload with 400 Bad Request');
  assert(res1.body.errors.length >= 5, `Middleware returns structured field errors (found ${res1.body.errors.length})`);

  // 7. Test validateCreateLead Middleware with Invalid Email & Invalid Status
  const req2 = {
    body: {
      name: 'Bob Jones',
      email: 'bad-email',
      phone: '9876543210',
      company: 'Acme Inc',
      source: 'Website',
      status: 'InvalidStatus',
    },
  };
  const res2 = mockResponse();
  let nextCalled2 = false;
  validateCreateLead(req2, res2, () => { nextCalled2 = true; });
  assert(res2.statusCode === 400, 'Middleware rejects payload with invalid email and invalid status');
  const emailFieldErr = res2.body.errors.find(e => e.field === 'email');
  const statusFieldErr = res2.body.errors.find(e => e.field === 'status');
  assert(emailFieldErr !== undefined, 'Middleware specifically flags "email" field error');
  assert(statusFieldErr !== undefined, 'Middleware specifically flags "status" field error');

  // 8. Test validateCreateLead Middleware with Valid Payload
  const req3 = {
    body: {
      name: 'Bob Jones',
      email: 'bob@acme.com',
      phone: '+91 9876543210',
      company: 'Acme Inc',
      source: 'Referral',
      status: 'Contacted',
    },
  };
  const res3 = mockResponse();
  let nextCalled3 = false;
  validateCreateLead(req3, res3, () => { nextCalled3 = true; });
  assert(nextCalled3 === true, 'Middleware calls next() for completely valid payload');

  // 9. Test validateUpdateLead Middleware with partial valid fields
  const req4 = {
    body: {
      status: 'Qualified',
    },
  };
  const res4 = mockResponse();
  let nextCalled4 = false;
  validateUpdateLead(req4, res4, () => { nextCalled4 = true; });
  assert(nextCalled4 === true, 'validateUpdateLead allows partial update when fields are valid');

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log('[ALL TESTS PASSED]');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
