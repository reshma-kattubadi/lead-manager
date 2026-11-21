import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  onResetFilters,
  totalResults = 0,
}) => {
  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];
  const sources = [
    'All',
    'Website',
    'Referral',
    'LinkedIn',
    'Cold Call',
    'Email Campaign',
    'Other',
  ];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || sourceFilter !== 'All';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, company, or email..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label className="text-xs font-semibold text-slate-500 hidden md:inline">Status:</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Source Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label className="text-xs font-semibold text-slate-500 hidden md:inline">Source:</label>
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => onSourceChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source === 'All' ? 'All Sources' : source}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            title="Reset Filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Results Badge */}
        <span className="text-xs font-medium text-slate-400 pl-1">
          Showing <span className="font-bold text-slate-700">{totalResults}</span> leads
        </span>
      </div>
    </div>
  );
};

export default SearchFilterBar;
