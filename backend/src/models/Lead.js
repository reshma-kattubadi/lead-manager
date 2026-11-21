const mongoose = require('mongoose');

const leadSources = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+0-9\s\-()]{7,20}$/;

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [phoneRegex, 'Please provide a valid phone number (7-20 digits)'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: {
        values: leadSources,
        message: '{VALUE} is not a valid lead source',
      },
    },
    status: {
      type: String,
      required: [true, 'Lead status is required'],
      enum: {
        values: leadStatuses,
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high performance querying & searching
leadSchema.index({ name: 'text', company: 'text' });
leadSchema.index({ status: 1, createdAt: -1 });

module.exports = {
  Lead: mongoose.model('Lead', leadSchema),
  LEAD_SOURCES: leadSources,
  LEAD_STATUSES: leadStatuses,
};
