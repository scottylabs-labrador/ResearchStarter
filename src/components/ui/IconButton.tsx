import React from "react";
import { cx } from "./cx";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  size?: "sm" | "md";
  pressed?: boolean;
  bordered?: boolean;
}

const IconButton = ({ size = "md", pressed, bordered = false, className, type = "button", children, ...rest }: IconButtonProps) => (
  <button
    type={type}
    aria-pressed={pressed}
    className={cx(
      "inline-flex shrink-0 items-center justify-center rounded-control transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
      size === "sm" ? "h-[32px] w-[32px]" : "h-[36px] w-[36px]",
      pressed ? "text-accent-strong" : "text-ink-muted hover:text-ink",
      bordered ? "border border-hairline-strong bg-surface hover:bg-surface-muted" : "hover:bg-accent-bg/50",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default IconButton;
