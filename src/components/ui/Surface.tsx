import React from "react";
import { cx } from "./cx";

type SurfaceElement = "div" | "section" | "aside" | "article";

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: SurfaceElement;
  interactive?: boolean;
}

const Surface = ({ as: Component = "div", interactive = false, className, ...rest }: SurfaceProps) => (
  <Component
    className={cx(
      "rounded-surface border border-hairline bg-surface",
      interactive &&
        "transition-[border-color,box-shadow] duration-200 ease-out hover:border-hairline-strong hover:shadow-card-hover",
      className
    )}
    {...rest}
  />
);

export default Surface;
