import React from "react";
import { cx } from "./cx";

interface MetaProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Meta = ({ icon, children, className }: MetaProps) => (
  <span className={cx("inline-flex min-w-0 items-center gap-1 font-mono text-meta text-ink-muted", className)}>
    {icon ? <span className="flex shrink-0">{icon}</span> : null}
    <span className="truncate">{children}</span>
  </span>
);

interface MetaRowProps {
  children: React.ReactNode;
  className?: string;
}

export const MetaRow = ({ children, className }: MetaRowProps) => {
  const items = React.Children.toArray(children).filter((item) => item !== "");
  return (
    <div className={cx("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden="true" className="text-ink-muted">
              ·
            </span>
          ) : null}
          {item}
        </React.Fragment>
      ))}
    </div>
  );
};
