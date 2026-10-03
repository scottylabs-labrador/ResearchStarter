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

// Icon-side padding is about 0.85× the text side, and the icon drops half a pixel onto the capitals' centre.
const Badge = ({ tone = "neutral", icon, children, className }: BadgeProps) => (
  <span
    className={cx(
      "inline-flex items-center gap-1 rounded-chip px-2 py-[2px] text-meta font-medium [&>svg]:-translate-y-[0.5px]",
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
