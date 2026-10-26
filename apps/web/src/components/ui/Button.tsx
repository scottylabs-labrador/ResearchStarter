import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

// No shrink on press: a scale transform redraws the label on a different pixel grid, so at fractional display
// scales (125%, 150%) it would jump by up to half a pixel. Pressing darkens the fill instead.
const base =
  "inline-flex items-center justify-center gap-[5px] whitespace-nowrap rounded-control font-medium transition-[background-color,border-color,color,opacity] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent-strong text-white shadow-accent hover:bg-accent-strong/90 active:bg-accent-strong",
  secondary: "border border-hairline-strong bg-surface text-ink hover:bg-surface-muted active:bg-hairline",
  ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink active:bg-hairline",
  danger: "bg-danger text-white hover:opacity-90 active:opacity-80",
};

const sizes: Record<Size, string> = {
  sm: "h-[32px] px-3 text-small",
  md: "h-[40px] px-4 text-body",
};

// Icons are cropped to their ink (./icons), so the icon side is set about 0.85× the text side, which reads as even.
const iconSidePadding: Record<Size, { start: string; end: string }> = {
  sm: { start: "ps-[11px]", end: "pe-[11px]" },
  md: { start: "ps-[14px]", end: "pe-[14px]" },
};

const buttonClasses = (
  variant: Variant = "secondary",
  size: Size = "md",
  { icon, iconRight, className }: { icon?: React.ReactNode; iconRight?: React.ReactNode; className?: string }
) =>
  cx(base, variants[variant], sizes[size], icon ? iconSidePadding[size].start : null, iconRight ? iconSidePadding[size].end : null, className);

interface StyleProps {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

interface ButtonProps extends StyleProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, icon, iconRight, className, children, type = "button", ...rest }, ref) => (
    <button ref={ref} type={type} className={buttonClasses(variant, size, { icon, iconRight, className })} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
);

Button.displayName = "Button";

interface ButtonLinkProps extends StyleProps, Omit<LinkProps, "className"> {
  className?: string;
}

export const ButtonLink = ({ variant, size, icon, iconRight, className, children, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClasses(variant, size, { icon, iconRight, className })} {...rest}>
    {icon}
    {children}
    {iconRight}
  </Link>
);

export default Button;
