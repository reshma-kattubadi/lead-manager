import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Share2, Activity, AlertCircle, Loader2 } from 'lucide-react';

const SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

const LeadModal = ({ isOpen, onClose, onSubmit, lead = null, isSubmitting = false }) => {
  const isEditMode = Boolean(lead);

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    status: 'New',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        source: lead.source || 'Website',
        status: lead.status || 'New',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setTouched({});
  }, [lead, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time client-side validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value || !value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required';
        if (!/^[+0-9\s\-()]{7,20}$/.test(value.trim())) {
          return 'Enter a valid phone number (7-20 digits)';
        }
        return '';
      case 'company':
        if (!value || !value.trim()) return 'Company name is required';
        return '';
      case 'source':
        if (!value) return 'Lead source is required';
        return '';
      case 'status':
        if (!value) return 'Lead status is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time error feedback if user already touched field
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) formErrors[key] = errorMsg;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        company: true,
        source: true,
        status: true,
      });
      return;
    }

    // Submit payload
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? 'Edit Lead Details' : 'Add New Lead'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update contact info and stage status for this deal.'
                : 'Capture a new sales opportunity into the database.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Sarah Connor"
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                  errors.name ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all`}
              />
            </div>
            {errors.name && (
              <p className="flex items-center text-rose-500 text-xs font-medium mt-1">
                <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="sarah@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                    errors.email ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                  } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center text-rose-500 text-xs font-medium mt-1">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                    errors.phone ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                  } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all`}
                />
              </div>
              {errors.phone && (
                <p className="flex items-center text-rose-500 text-xs font-medium mt-1">
                  <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Cyberdyne Systems"
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                  errors.company ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all`}
              />
            </div>
            {errors.company && (
              <p className="flex items-center text-rose-500 text-xs font-medium mt-1">
                <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                {errors.company}
              </p>
            )}
          </div>

          {/* Source & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Source Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lead Source <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Share2 className="h-4 w-4" />
                </div>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                >
                  {SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lead Status <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Activity className="h-4 w-4" />
                </div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditMode ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
