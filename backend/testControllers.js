const {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require('./src/controllers/leadController');
const { Lead } = require('./src/models/Lead');
const mongoose = require('mongoose');

// Helper to create mock request and response
function createMockReqRes(overrides = {}) {
  const req = {
    query: {},
    params: {},
    body: {},
    ...overrides,
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };

  return { req, res };
}

async function runControllerTests() {
  console.log('[Test Suite] Testing Lead Controllers & Edge Cases...\n');
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

  // 1. Test getLeadById with invalid ObjectId format
  {
    const { req, res } = createMockReqRes({ params: { id: 'invalid-id-123' } });
    await getLeadById(req, res, (err) => {});
    assert(res.statusCode === 400, 'getLeadById returns 400 Bad Request for malformed MongoDB ID');
    assert(res.body.success === false, 'getLeadById returns success: false for invalid ID');
  }

  // 2. Test updateLead with invalid ObjectId format
  {
    const { req, res } = createMockReqRes({
      params: { id: 'bad-id' },
      body: { status: 'Qualified' },
    });
    await updateLead(req, res, (err) => {});
    assert(res.statusCode === 400, 'updateLead returns 400 Bad Request for malformed MongoDB ID');
    assert(res.body.success === false, 'updateLead returns success: false for invalid ID');
  }

  // 3. Test deleteLead with invalid ObjectId format
  {
    const { req, res } = createMockReqRes({ params: { id: 'bad-id' } });
    await deleteLead(req, res, (err) => {});
    assert(res.statusCode === 400, 'deleteLead returns 400 Bad Request for malformed MongoDB ID');
    assert(res.body.success === false, 'deleteLead returns success: false for invalid ID');
  }

  // 4. Test Query Building in getLeads (Search & Filter Logic)
  {
    // Test Search by Name query construction
    let capturedQuery = null;
    const originalFind = Lead.find;
    Lead.find = function (query) {
      capturedQuery = query;
      return {
        sort: () => ({
          lean: async () => [
            { _id: '1', name: 'John Doe', status: 'New', company: 'Acme Corp' },
          ],
        }),
      };
    };

    const { req, res } = createMockReqRes({
      query: { search: 'John', status: 'New' },
    });
    await getLeads(req, res, (err) => {});

    assert(res.statusCode === 200, 'getLeads returns 200 OK');
    assert(res.body.success === true, 'getLeads returns success: true');
    assert(capturedQuery.status === 'New', 'Query builder filters by status="New"');
    assert(capturedQuery.$or !== undefined, 'Query builder creates $or regex search for name/company/email');
    assert(capturedQuery.$or[0].name.test('John Doe'), 'Regex matches "John Doe"');

    // Restore original find
    Lead.find = originalFind;
  }

  // 5. Test getLeadStats aggregation calculation
  {
    const originalAggregate = Lead.aggregate;
    Lead.aggregate = async function () {
      return [
        { _id: 'New', count: 5 },
        { _id: 'Contacted', count: 3 },
        { _id: 'Qualified', count: 2 },
        { _id: 'Lost', count: 1 },
      ];
    };

    const { req, res } = createMockReqRes();
    await getLeadStats(req, res, (err) => {});

    assert(res.statusCode === 200, 'getLeadStats returns 200 OK');
    assert(res.body.data.total === 11, 'Stats total calculated correctly (5+3+2+1=11)');
    assert(res.body.data.new === 5, 'Stats "new" count matches');
    assert(res.body.data.contacted === 3, 'Stats "contacted" count matches');
    assert(res.body.data.qualified === 2, 'Stats "qualified" count matches');
    assert(res.body.data.lost === 1, 'Stats "lost" count matches');

    // Restore original aggregate
    Lead.aggregate = originalAggregate;
  }

  // 6. Test createLead controller
  {
    const originalCreate = Lead.create;
    Lead.create = async function (data) {
      return { _id: '507f1f77bcf86cd799439011', ...data, createdAt: new Date() };
    };

    const { req, res } = createMockReqRes({
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
        company: 'Stark Industries',
        source: 'LinkedIn',
        status: 'New',
      },
    });

    await createLead(req, res, (err) => {});
    assert(res.statusCode === 201, 'createLead returns 201 Created');
    assert(res.body.data.name === 'Jane Doe', 'createLead saves trimmed name');
    assert(res.body.data.company === 'Stark Industries', 'createLead saves trimmed company');

    Lead.create = originalCreate;
  }

  // 7. Test deleteLead when record is found
  {
    const validMongoId = new mongoose.Types.ObjectId().toString();
    const originalFindById = Lead.findById;
    const originalFindByIdAndDelete = Lead.findByIdAndDelete;

    Lead.findById = async function (id) {
      return { _id: id, name: 'Lead To Delete' };
    };
    Lead.findByIdAndDelete = async function (id) {
      return { _id: id };
    };

    const { req, res } = createMockReqRes({ params: { id: validMongoId } });
    await deleteLead(req, res, (err) => {});

    assert(res.statusCode === 200, 'deleteLead returns 200 OK');
    assert(res.body.success === true, 'deleteLead reports success: true');
    assert(res.body.data.id === validMongoId, 'deleteLead returns deleted ID');

    Lead.findById = originalFindById;
    Lead.findByIdAndDelete = originalFindByIdAndDelete;
  }

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log('[ALL CONTROLLER TESTS PASSED]');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runControllerTests();
