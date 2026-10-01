import { cx } from "./cx";

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  "aria-label": string;
  className?: string;
}

function SegmentedControl<T extends string>({ value, onChange, options, className, "aria-label": ariaLabel }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx("inline-flex items-center gap-[2px] rounded-control bg-surface-muted p-[2px]", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "h-[28px] rounded-[8px] px-3 text-small transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35",
              active
                ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgb(24_24_27/0.08),0_0_0_1px_rgb(var(--hairline))]"
                : "text-ink-secondary hover:text-ink"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
