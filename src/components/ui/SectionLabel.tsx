import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { cx } from "./cx";

interface SectionLabelProps {
  children: React.ReactNode;
  as?: "h2" | "h3" | "p";
  collapsed?: boolean;
  onToggle?: () => void;
  action?: React.ReactNode;
  className?: string;
}

const labelText = "font-mono text-meta font-medium text-ink-muted";

const SectionLabel = ({ children, as: Heading = "h3", collapsed = false, onToggle, action, className }: SectionLabelProps) => (
  <div className={cx("flex min-h-[24px] items-center justify-between gap-2", className)}>
    <Heading className="m-0 min-w-0">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className={cx(
            labelText,
            "inline-flex items-center gap-1 rounded transition-colors duration-150 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          )}
        >
          {children}
          <KeyboardArrowDownIcon
            sx={{ fontSize: 16 }}
            className={cx("transition-transform duration-200 ease-out motion-reduce:transition-none", collapsed && "-rotate-90")}
          />
        </button>
      ) : (
        <span className={cx(labelText, "inline-flex items-center gap-1.5")}>{children}</span>
      )}
    </Heading>
    {action}
  </div>
);

export default SectionLabel;
