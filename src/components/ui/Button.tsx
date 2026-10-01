import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent-strong text-white shadow-accent hover:bg-accent-strong/90 active:bg-accent-strong",
  secondary: "border border-hairline-strong bg-surface text-ink hover:bg-surface-muted",
  ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-[32px] px-3 text-small",
  md: "h-[40px] px-4 text-body",
};

const buttonClasses = (variant: Variant = "secondary", size: Size = "md", className?: string) =>
  cx(base, variants[variant], sizes[size], className);

interface StyleProps {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

interface ButtonProps extends StyleProps, React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ variant, size, icon, iconRight, className, children, type = "button", ...rest }: ButtonProps) => (
  <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
    {icon}
    {children}
    {iconRight}
  </button>
);

interface ButtonLinkProps extends StyleProps, Omit<LinkProps, "className"> {
  className?: string;
}

export const ButtonLink = ({ variant, size, icon, iconRight, className, children, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClasses(variant, size, className)} {...rest}>
    {icon}
    {children}
    {iconRight}
  </Link>
);

export default Button;
