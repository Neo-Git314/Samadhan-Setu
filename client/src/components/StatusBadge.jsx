import React from 'react';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-300' },
  reviewed:    { label: 'Reviewed',    bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-300' },
  assigned:    { label: 'Assigned',    bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300' },
  in_progress: { label: 'In Progress', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' },
  resolved:    { label: 'Resolved',    bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-300' },
  duplicate:   { label: 'Duplicate',   bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-300' },
  // project statuses
  proposed:    { label: 'Proposed',    bg: 'bg-sky-50',    text: 'text-sky-800',    border: 'border-sky-300' },
  approved:    { label: 'Approved',    bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-300' },
  testing:     { label: 'Testing',     bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-300' },
  completed:   { label: 'Completed',   bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-300' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`badge border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}
