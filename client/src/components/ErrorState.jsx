import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'An unexpected error occurred', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-red-700 mb-1">Error Loading Data</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 text-sm font-medium text-navy-800 bg-navy-50 border border-navy-200 px-4 py-2 rounded hover:bg-navy-100 transition-colors"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  );
}
