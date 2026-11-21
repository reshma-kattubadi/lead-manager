const mongoose = require('mongoose');
const { Lead, LEAD_STATUSES } = require('../models/Lead');

/**
 * @desc    Get all leads with search, filter, sorting, and optional pagination
 * @route   GET /api/leads
 * @access  Public
 */
const getLeads = async (req, res, next) => {
  try {
    const { search, status, source, sort, page, limit } = req.query;

    const query = {};

    // Filter by Status if provided and valid
    if (status && status !== 'All') {
      if (LEAD_STATUSES.includes(status)) {
        query.status = status;
      }
    }

    // Filter by Source if provided
    if (source && source !== 'All') {
      query.source = source;
    }

    // Search by Name, Company, or Email (case-insensitive)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ];
    }

    // Sorting: default to newest first (-createdAt)
    const sortBy = sort || '-createdAt';

    // Count total matching records before pagination
    const total = await Lead.countDocuments(query);

    let leadsQuery = Lead.find(query).sort(sortBy);

    // Apply pagination if limit is specified
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10);

    if (limitNum && limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      leadsQuery = leadsQuery.skip(skip).limit(limitNum);
    }

    const leads = await leadsQuery.lean();

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      totalPages: limitNum && limitNum > 0 ? Math.ceil(total / limitNum) : 1,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard lead statistics
 * @route   GET /api/leads/stats
 * @access  Public
 */
const getLeadStats = async (req, res, next) => {
  try {
    const counts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
    };

    counts.forEach((item) => {
      const statusKey = item._id ? item._id.toLowerCase() : null;
      if (statusKey && stats.hasOwnProperty(statusKey)) {
        stats[statusKey] = item.count;
      }
      stats.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 * @access  Public
 */
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid lead ID format: ${id}`,
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const newLead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      source,
      status: status || 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing lead
 * @route   PUT /api/leads/:id
 * @access  Public
 */
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid lead ID format: ${id}`,
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const updatedData = { ...req.body };
    if (updatedData.name) updatedData.name = updatedData.name.trim();
    if (updatedData.email) updatedData.email = updatedData.email.trim().toLowerCase();
    if (updatedData.phone) updatedData.phone = updatedData.phone.trim();
    if (updatedData.company) updatedData.company = updatedData.company.trim();

    const updatedLead = await Lead.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Public
 */
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid lead ID format: ${id}`,
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await Lead.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
