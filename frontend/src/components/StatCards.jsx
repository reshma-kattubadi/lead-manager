import React from 'react';
import { Users, Sparkles, PhoneCall, CheckCircle, XCircle } from 'lucide-react';

const StatCards = ({ stats = { total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 }, activeStatus = 'All', onStatusSelect }) => {
  const cards = [
    {
      id: 'All',
      label: 'Total Leads',
      count: stats.total,
      icon: Users,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: activeStatus === 'All' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200',
      badge: 'All Pipeline',
    },
    {
      id: 'New',
      label: 'New',
      count: stats.new,
      icon: Sparkles,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: activeStatus === 'New' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200',
      badge: 'Uncontacted',
    },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: stats.contacted,
      icon: PhoneCall,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: activeStatus === 'Contacted' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200',
      badge: 'In Outreach',
    },
    {
      id: 'Qualified',
      label: 'Qualified',
      count: stats.qualified,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: activeStatus === 'Qualified' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200',
      badge: 'High Value',
    },
    {
      id: 'Lost',
      label: 'Lost',
      count: stats.lost,
      icon: XCircle,
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: activeStatus === 'Lost' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200',
      badge: 'Closed',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onStatusSelect && onStatusSelect(card.id)}
            className={`p-4 rounded-2xl bg-white border ${card.borderColor} shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-98`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.bgColor} ${card.iconColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {card.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatCards;
