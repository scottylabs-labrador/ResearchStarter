import React from "react";
import { cx } from "./cx";

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

/** An inline error message, announced to screen readers when it appears. */
const Alert = ({ children, className }: AlertProps) => (
  <p role="alert" className={cx("rounded-control border border-danger/20 bg-danger-bg px-4 py-3 text-small text-danger", className)}>
    {children}
  </p>
);

export default Alert;
