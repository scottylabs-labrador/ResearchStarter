import React from "react";
import { cx } from "./cx";

interface MetaProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Meta = ({ icon, children, className }: MetaProps) => (
  <span className={cx("inline-flex min-w-0 items-center gap-1 font-mono text-meta text-ink-muted", className)}>
    {icon ? <span className="flex shrink-0 -translate-y-[0.5px]">{icon}</span> : null}
    <span className="truncate">{children}</span>
  </span>
);

interface MetaRowProps {
  children: React.ReactNode;
  className?: string;
}

// Every item carries a leading separator; the row is shifted back by one separator
// width and clipped, so the separator that starts each wrapped line is hidden.
// The clip keeps 4px of inline room so focus rings on links inside aren't cut off.
export const MetaRow = ({ children, className }: MetaRowProps) => {
  const items = React.Children.toArray(children).filter((item) => item !== "");
  return (
    <div className={cx("-mx-1 overflow-x-clip px-1", className)}>
      <div className="-ms-5 flex flex-wrap items-center gap-y-1">
        {items.map((item, i) => (
          <span key={i} className="inline-flex min-w-0 max-w-full items-center">
            <span aria-hidden="true" className="w-5 shrink-0 text-center text-ink-muted">
              ·
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
