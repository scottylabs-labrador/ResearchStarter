import React from 'react';

interface DeadlineCardProps {
  deadline: string;
}

export const HourglassIcon = ({ size = 64, color = 'currentColor' }) => (
    <svg
      width={size}
      height={(size * 1.5)}
      viewBox="0 0 64 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      stroke={color}
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Frame */}
      <rect x="6" y="6" width="52" height="12" rx="2" />
      <rect x="6" y="78" width="52" height="12" rx="2" />
  
      {/* Glass outline */}
      <path d="M18 18c0 8 14 18 14 30s-14 22-14 30" />
      <path d="M46 18c0 8-14 18-14 30s14 22 14 30" />
  
      {/* Neck */}
      <line x1="28" y1="48" x2="36" y2="48" />
    </svg>
  );
  
const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => {
  return (
    <div className="bg-hippo-pink-200 p-4 rounded-lg flex items-center shadow-md space-x-3 shadow">
      {/* Sandglass Icon */}
      <HourglassIcon size={24} color="#DB2777" />
      <div>
        <p className="text-pink-800 font-semibold">Deadline to apply</p>
        <p className="text-pink-700 text-sm">{deadline}</p>
      </div>
    </div>
  );
};

export default DeadlineCard;
