import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, lead, isDeleting = false }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 animate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center ring-4 ring-rose-50/50 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Delete Lead Confirmation
            </h3>
            <p className="text-xs text-slate-500">
              Compulsory assignment requirement #4
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-bold text-slate-900">{lead.name}</span> from{' '}
          <span className="font-semibold text-slate-800">{lead.company}</span>? This record will be permanently removed from MongoDB.
        </p>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(lead._id || lead.id)}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-200 hover:shadow-rose-300 transition-all disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Lead'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
