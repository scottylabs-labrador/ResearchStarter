import React from "react";
import { cx } from "./cx";

export const fieldClass =
  "block w-full rounded-control border border-hairline-strong bg-surface px-3 py-2 text-body text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-ink-muted focus:border-accent focus:ring-2 focus:ring-accent/15";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  inputSize?: "sm" | "md";
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, trailing, inputSize = "md", className, containerClassName, ...rest }, ref) => (
    <div
      className={cx(
        "flex items-center gap-2 rounded-control border border-hairline-strong bg-surface px-3 transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15",
        inputSize === "sm" ? "h-[32px]" : "h-[40px]",
        containerClassName
      )}
    >
      {icon ? <span className="flex shrink-0 text-ink-muted">{icon}</span> : null}
      <input
        ref={ref}
        className={cx(
          "h-full w-full min-w-0 border-none bg-transparent p-0 text-body text-ink outline-none placeholder:text-ink-muted",
          className
        )}
        {...rest}
      />
      {trailing}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
