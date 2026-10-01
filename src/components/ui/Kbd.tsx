import React from "react";
import { cx } from "./cx";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

const Kbd = ({ children, className }: KbdProps) => (
  <kbd
    className={cx(
      "inline-flex h-[20px] min-w-[20px] items-center justify-center rounded border border-hairline bg-surface-muted px-1 font-mono text-[11px] text-ink-muted",
      className
    )}
  >
    {children}
  </kbd>
);

export default Kbd;
