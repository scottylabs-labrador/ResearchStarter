import React from "react";
import Surface from "../ui/Surface";
import Badge from "../ui/Badge";

interface DeadlineCardProps {
  deadline: string;
}

export const HourglassIcon = ({ size = 64, color = "currentColor" }) => (
  <svg
    width={size}
    height={size * 1.5}
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
    <rect x="6" y="6" width="52" height="12" rx="2" />
    <rect x="6" y="78" width="52" height="12" rx="2" />
    <path d="M18 18c0 8 14 18 14 30s-14 22-14 30" />
    <path d="M46 18c0 8-14 18-14 30s14 22 14 30" />
    <line x1="28" y1="48" x2="36" y2="48" />
  </svg>
);

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => (
  <Surface className="flex items-center gap-3 p-4">
    <span className="flex text-warning">
      <HourglassIcon size={16} />
    </span>
    <div className="flex flex-col gap-1">
      <p className="text-small font-medium text-ink">Deadline to apply</p>
      <Badge tone="warning" className="self-start">
        {deadline}
      </Badge>
    </div>
  </Surface>
);

export default DeadlineCard;
