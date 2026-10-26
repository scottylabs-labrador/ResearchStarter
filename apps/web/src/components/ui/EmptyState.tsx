import React from "react";
import { cx } from "./cx";

interface EmptyStateProps {
  title: string;
  /** h1 when the empty state is the whole page (404, not found); otherwise a plain line. */
  titleAs?: "p" | "h1";
  icon?: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ title, titleAs: Title = "p", icon, message, action, className }: EmptyStateProps) => (
  <div
    className={cx(
      "flex flex-col items-center justify-center gap-2 rounded-surface border border-hairline bg-canvas bg-hairline-texture px-6 py-14 text-center",
      className
    )}
  >
    {icon ? (
      <span className="mb-1 flex h-[40px] w-[40px] items-center justify-center rounded-control border border-hairline bg-surface text-ink-muted">
        {icon}
      </span>
    ) : null}
    <Title className="text-heading text-ink">{title}</Title>
    {message ? <p className="max-w-sm text-body text-ink-secondary">{message}</p> : null}
    {action ? <div className="mt-3">{action}</div> : null}
  </div>
);

export default EmptyState;
