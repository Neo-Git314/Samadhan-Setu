import React from 'react';

const STATUS_CONFIG = {
  submitted:    { label: 'Submitted',    bg: 'bg-blue-50',    text: 'text-blue-800',    border: 'border-blue-300' },
  pending:      { label: 'Submitted',    bg: 'bg-blue-50',    text: 'text-blue-800',    border: 'border-blue-300' },
  under_review: { label: 'Under Review', bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-300' },
  reviewed:     { label: 'Under Review', bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-300' },
  assigned:     { label: 'Assigned',     bg: 'bg-indigo-50',  text: 'text-indigo-800',  border: 'border-indigo-300' },
  in_progress:  { label: 'In Progress',  bg: 'bg-sky-50',     text: 'text-sky-800',     border: 'border-sky-300' },
  action_taken: { label: 'In Progress',  bg: 'bg-sky-50',     text: 'text-sky-800',     border: 'border-sky-300' },
  resolved:     { label: 'Resolved',     bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
  closed:       { label: 'Closed',       bg: 'bg-gray-100',   text: 'text-gray-700',    border: 'border-gray-300' },
  duplicate:    { label: 'Duplicate',    bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-300' },
  // project statuses
  proposed:     { label: 'Proposed',     bg: 'bg-sky-50',     text: 'text-sky-800',     border: 'border-sky-300' },
  approved:     { label: 'Approved',     bg: 'bg-teal-50',    text: 'text-teal-800',    border: 'border-teal-300' },
  testing:      { label: 'Testing',      bg: 'bg-violet-50',  text: 'text-violet-800',  border: 'border-violet-300' },
  completed:    { label: 'Completed',    bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
};

export default function StatusBadge({ status }) {
  const normalizedKey = (status || '').toLowerCase().replace(/[\s-]+/g, '_');
  const cfg = STATUS_CONFIG[normalizedKey] || {
    label: (status || 'Submitted').replace(/_/g, ' '),
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300'
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}
