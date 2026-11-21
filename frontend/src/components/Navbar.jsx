import React from 'react';
import { Sparkles, Users, Database, ShieldCheck } from 'lucide-react';

const Navbar = ({ totalLeads = 0 }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">LeadManager</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Meru Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Sales Pipeline & Tracking Application</p>
            </div>
          </div>

          {/* Right side stats pill and user indicator */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Count Pill */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>MongoDB Records:</span>
              <span className="bg-white px-2 py-0.5 rounded-md font-bold text-slate-900 shadow-sm">{totalLeads}</span>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">System Active</span>
            </div>

            {/* User profile badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-200">
                MT
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Meru Developer</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">Screening Demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
