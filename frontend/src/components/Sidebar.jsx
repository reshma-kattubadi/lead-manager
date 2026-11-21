import React from 'react';
import {
  Users,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Settings,
  HelpCircle,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, closeMobileSidebar, activeTab = 'leads' }) => {
  const navItems = [
    { id: 'leads', name: 'Leads Pipeline', icon: Users, active: true },
    { id: 'dashboard', name: 'Performance Stats', icon: BarChart3, active: false },
    { id: 'companies', name: 'Accounts & Orgs', icon: Briefcase, active: false },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Sidebar Header for Mobile */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden">
        <span className="font-bold text-slate-800">Navigation</span>
        <button
          onClick={closeMobileSidebar}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                item.active
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.name}</span>
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Assignment Specs
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>MERN Stack</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Full CRUD + Search</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Two-Way Validation</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="p-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
        <div className="flex items-center space-x-2 text-slate-700 font-medium">
          <FolderGit2 className="w-4 h-4 text-slate-400" />
          <span>Meru Screening App</span>
        </div>
        <p className="text-[11px] text-slate-400">Node v24 + React + Vite + Tailwind</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
