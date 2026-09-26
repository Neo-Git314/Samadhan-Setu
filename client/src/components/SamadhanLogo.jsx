import React from 'react';

/**
 * Samadhan Setu Official Brand Icon & Logo Component
 * - 3 interconnected citizen & institutional figures
 * - Central civic solution symbol
 * - Dynamic Setu (Bridge) foundation arch
 * - Navy Blue (#123B68), Medium Blue (#2878B8), Orange (#F58220)
 */
export default function SamadhanLogo({
  className = 'w-10 h-10',
  withText = false,
  subtitleClassName = 'text-xs text-[#58718A]'
}) {
  const icon = (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Background circular guide (transparent) */}
        <circle cx="50" cy="50" r="48" fill="transparent" />

        {/* 1. Center Figure (Citizen & Community) */}
        <circle cx="50" cy="22" r="6.5" fill="#123B68" />
        <path
          d="M39 42 C39 33, 61 33, 61 42"
          stroke="#123B68"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 2. Left Figure (Public Administration & Civic Bodies) */}
        <circle cx="26" cy="32" r="5.5" fill="#2878B8" />
        <path
          d="M17 50 C19 42, 33 41, 36 49"
          stroke="#2878B8"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 3. Right Figure (Universities & Collaborative Partners) */}
        <circle cx="74" cy="32" r="5.5" fill="#2878B8" />
        <path
          d="M64 49 C67 41, 81 42, 83 50"
          stroke="#2878B8"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 4. Connecting Link Arms (People to Institutions bridge) */}
        <path
          d="M26 48 C37 42, 63 42, 74 48"
          stroke="#123B68"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="none"
        />

        {/* 5. Dynamic Setu (Bridge / Uplift Arch) - Primary Navy */}
        <path
          d="M18 62 C34 53, 66 53, 82 62 C74 70, 48 73, 18 62 Z"
          fill="#123B68"
        />

        {/* 6. Vibrant Orange Foundation Arc (Citizen Empowerment & Solution Bridge) */}
        <path
          d="M22 68 C38 60, 62 60, 78 68 C71 77, 43 80, 22 68 Z"
          fill="#F58220"
        />

        {/* 7. Central Civic Spark / Problem Solving Pivot */}
        <circle cx="50" cy="48" r="3" fill="#F58220" />
      </svg>
    </div>
  );

  if (!withText) return icon;

  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex flex-col">
        <span className="text-[#123B68] font-black text-xl tracking-tight leading-none">
          SAMADHAN SETU
        </span>
        <span className={subtitleClassName}>
          National Civic Grievance &amp; Collaborative Problem Solving Platform
        </span>
      </div>
    </div>
  );
}
