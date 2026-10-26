import React from "react";
import { cx } from "./cx";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  pressed?: boolean;
}

const IconButton = ({ pressed, className, type = "button", children, ...rest }: IconButtonProps) => (
  <button
    type={type}
    aria-pressed={pressed}
    className={cx(
      "inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-control transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent-bg/50 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
      pressed ? "text-accent-strong" : "text-ink-muted hover:text-ink",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default IconButton;
