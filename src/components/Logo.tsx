import logo from "../assets/logo.png";
import { cx } from "./ui/cx";

type LogoSize = "sm" | "lg";

// logo.png has wide built-in margins (the mark spans ~62% x 37% of it), so crop to the mark.
const sizes: Record<LogoSize, { box: string; img: string }> = {
  sm: { box: "h-[26px] w-[74px]", img: "h-[70px]" },
  lg: { box: "h-[40px] w-[112px]", img: "h-[108px]" },
};

interface LogoProps {
  size?: LogoSize;
  alt?: string;
  className?: string;
}

const Logo = ({ size = "sm", alt = "", className }: LogoProps) => (
  <span className={cx("relative block overflow-hidden", sizes[size].box, className)}>
    <img
      src={logo}
      alt={alt}
      className={cx("absolute left-1/2 top-1/2 w-auto max-w-none -translate-x-1/2 -translate-y-1/2", sizes[size].img)}
    />
  </span>
);

export default Logo;
