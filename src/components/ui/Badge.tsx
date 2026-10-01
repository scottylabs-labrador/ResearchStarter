import React from "react";
import { cx } from "./cx";

type Tone = "neutral" | "positive" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-secondary",
  positive: "bg-positive-bg text-positive",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
};

interface BadgeProps {
  tone?: Tone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ tone = "neutral", icon, children, className }: BadgeProps) => (
  <span className={cx("inline-flex items-center gap-1 rounded-chip px-2 py-[2px] text-meta font-medium", tones[tone], className)}>
    {icon}
    {children}
  </span>
);

export default Badge;
