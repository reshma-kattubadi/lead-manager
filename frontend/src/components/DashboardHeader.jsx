import React from 'react';
import { UserPlus, RefreshCw, Menu } from 'lucide-react';

const DashboardHeader = ({ onAddLead, onRefresh, isLoading, openMobileSidebar }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
      <div className="flex items-center space-x-3">
        {/* Mobile menu trigger */}
        <button
          onClick={openMobileSidebar}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Leads Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track, qualify, and convert prospective customers into active deals.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Refresh Leads from MongoDB"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Add Lead Primary CTA */}
        <button
          onClick={onAddLead}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
