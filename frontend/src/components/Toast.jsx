import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';
  const isInfo = type === 'info';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-sky-50 border-sky-200 text-sky-900',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-modal">
      <div
        className={`flex items-start justify-between p-4 rounded-2xl border shadow-lg ${bgStyles[type] || bgStyles.success}`}
      >
        <div className="flex items-start space-x-3">
          {icons[type] || icons.success}
          <div className="text-sm font-medium leading-snug">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
