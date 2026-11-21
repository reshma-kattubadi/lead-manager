import React from 'react';
import { UserX, Plus, RefreshCw } from 'lucide-react';

const EmptyState = ({ isFiltered = false, onReset, onAddLead }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4 ring-8 ring-indigo-50/50">
        <UserX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        {isFiltered ? 'No matching leads found' : 'No leads in your pipeline yet'}
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
        {isFiltered
          ? 'Try adjusting your search keywords or switching status filters to see other records.'
          : 'Start building your sales pipeline by capturing your first lead into MongoDB.'}
      </p>

      <div className="flex items-center justify-center space-x-3">
        {isFiltered ? (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear Search & Filters</span>
          </button>
        ) : (
          <button
            onClick={onAddLead}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Lead</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
