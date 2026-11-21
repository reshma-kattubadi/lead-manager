import React from 'react';
import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const statusConfig = {
  New: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    icon: Sparkles,
  },
  Contacted: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    icon: PhoneCall,
  },
  Qualified: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  Lost: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

const LeadTable = ({ leads, onEdit, onDelete, onStatusUpdate, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  <div className="h-3 w-48 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6">Lead / Contact</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Company</th>
              <th scope="col" className="py-3.5 px-4">Source</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Added On</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.map((lead) => {
              const statusInfo = statusConfig[lead.status] || statusConfig.New;
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={lead._id || lead.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Name & Contact Info */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100 shrink-0">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {lead.name}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-slate-500 mt-0.5">
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center hover:text-indigo-600 hover:underline"
                            title={lead.email}
                          >
                            <Mail className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[160px] sm:max-w-[200px]">{lead.email}</span>
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center hover:text-indigo-600 hover:underline mt-0.5 sm:mt-0"
                            title={lead.phone}
                          >
                            <Phone className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 sm:px-6 font-medium text-slate-800">
                    <div className="inline-flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{lead.company}</span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-4 px-4 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {lead.source}
                    </span>
                  </td>

                  {/* Status Dropdown / Badge */}
                  <td className="py-4 px-4">
                    <div className="relative inline-block">
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusUpdate(lead, e.target.value)}
                        className={`appearance-none pl-6 pr-6 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                        title="Click to update status"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                      </select>
                      <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                    </div>
                  </td>

                  {/* Added On Date */}
                  <td className="py-4 px-4 text-xs text-slate-500 hidden md:table-cell">
                    <div className="inline-flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Lead Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(lead)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
