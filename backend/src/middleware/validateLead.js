const { LEAD_SOURCES, LEAD_STATUSES } = require('../models/Lead');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+0-9\s\-()]{7,20}$/;

/**
 * Middleware to validate lead creation or updates
 */
const validateLead = (isUpdate = false) => {
  return (req, res, next) => {
    const { name, email, phone, company, source, status } = req.body;
    const errors = [];

    // If it's a create operation, or if the field is provided during an update:
    if (!isUpdate || name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Name is required' });
      } else if (name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
      }
    }

    if (!isUpdate || email !== undefined) {
      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        errors.push({ field: 'email', message: 'Email is required' });
      } else if (!emailRegex.test(email.trim())) {
        errors.push({ field: 'email', message: 'Please provide a valid email address (e.g. name@domain.com)' });
      }
    }

    if (!isUpdate || phone !== undefined) {
      if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
        errors.push({ field: 'phone', message: 'Phone number is required' });
      } else if (!phoneRegex.test(phone.trim())) {
        errors.push({ field: 'phone', message: 'Please provide a valid phone number (7-20 digits)' });
      }
    }

    if (!isUpdate || company !== undefined) {
      if (!company || typeof company !== 'string' || company.trim().length === 0) {
        errors.push({ field: 'company', message: 'Company is required' });
      }
    }

    if (!isUpdate || source !== undefined) {
      if (!source || typeof source !== 'string') {
        errors.push({ field: 'source', message: 'Source is required' });
      } else if (!LEAD_SOURCES.includes(source)) {
        errors.push({
          field: 'source',
          message: `Source must be one of: ${LEAD_SOURCES.join(', ')}`,
        });
      }
    }

    if (!isUpdate || status !== undefined) {
      if (!status || typeof status !== 'string') {
        errors.push({ field: 'status', message: 'Status is required' });
      } else if (!LEAD_STATUSES.includes(status)) {
        errors.push({
          field: 'status',
          message: `Status must be one of: ${LEAD_STATUSES.join(', ')}`,
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

module.exports = {
  validateCreateLead: validateLead(false),
  validateUpdateLead: validateLead(true),
};
