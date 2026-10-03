import React from "react";
import { cx } from "./cx";

type Tone = "neutral" | "accent" | "positive";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-secondary",
  accent: "bg-accent-bg text-accent-strong",
  positive: "bg-positive-bg text-positive",
};

interface BadgeProps {
  tone?: Tone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// With an icon, the icon side is padded about 0.85× the text side, which reads as even.
const Badge = ({ tone = "neutral", icon, children, className }: BadgeProps) => (
  <span
    className={cx(
      "inline-flex items-center gap-1 rounded-chip px-2 py-[2px] text-meta font-medium",
      icon ? "ps-[7px]" : null,
      tones[tone],
      className
    )}
  >
    {icon}
    {children}
  </span>
);

export default Badge;
