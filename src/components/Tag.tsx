import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { cx } from "./ui/cx";

interface TagProps {
  keyword: string;
  className?: string;
  onRemove?: () => void;
}

const collegeAbr: Record<string, string> = {
  "College of Engineering": "Engineering",
  "College of Fine Arts": "CFA",
  "Dietrich College of Humanities & Social Sciences": "Dietrich",
  "Heinz College of Information Systems and Public Policy": "Heinz",
  "Mellon College of Science": "MCS",
  "School of Computer Science": "SCS",
  "Tepper School of Business": "Tepper",
  "Electrical & Computer Engineering": "ECE",
  "Artificial Intelligence": "AI",
};

const Tag = ({ keyword, className, onRemove }: TagProps) => {
  const label = collegeAbr[keyword] ?? keyword;
  return (
    <span
      title={label}
      className={cx(
        "inline-flex max-w-full items-center gap-1 rounded-chip bg-surface-muted px-2 py-[3px] text-small text-ink-secondary",
        className
      )}
    >
      <span className="truncate">{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-mr-1 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-ink-muted transition-colors duration-150 hover:bg-hairline hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <CloseOutlinedIcon sx={{ fontSize: 12 }} />
        </button>
      ) : null}
    </span>
  );
};

export default Tag;
