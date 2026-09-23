import React from 'react';

export default function LoadingSpinner({ message = 'Loading…', size = 'md' }) {
  const sz = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className={`${sz} border-4 border-navy-200 border-t-navy-800 rounded-full animate-spin mb-3`} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
