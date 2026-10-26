import { cx } from "./cx";

interface SpinnerProps {
  label?: string;
  className?: string;
}

const Spinner = ({ label = "Loading", className }: SpinnerProps) => (
  <span role="status" className={cx("inline-flex items-center justify-center", className)}>
    <span aria-hidden="true" className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
    <span className="sr-only">{label}</span>
  </span>
);

export default Spinner;
