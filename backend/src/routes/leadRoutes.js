const express = require('express');
const router = express.Router();

const {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');

const {
  validateCreateLead,
  validateUpdateLead,
} = require('../middleware/validateLead');

// Lead Statistics Route
router.get('/stats', getLeadStats);

// Lead Collection Routes (List & Create)
router.route('/')
  .get(getLeads)
  .post(validateCreateLead, createLead);

// Single Lead Routes (Read, Update & Delete)
router.route('/:id')
  .get(getLeadById)
  .put(validateUpdateLead, updateLead)
  .delete(deleteLead);

module.exports = router;
