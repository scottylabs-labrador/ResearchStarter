import { cx } from "./cx";

interface SpinnerProps {
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const Spinner = ({ size = "md", label = "Loading", className }: SpinnerProps) => (
  <span role="status" className={cx("inline-flex items-center justify-center", className)}>
    <span
      aria-hidden="true"
      className={cx(
        "animate-spin rounded-full border-2 border-ink/20 border-t-ink",
        size === "sm" ? "h-[20px] w-[20px]" : "h-[32px] w-[32px]"
      )}
    />
    <span className="sr-only">{label}</span>
  </span>
);

export default Spinner;
