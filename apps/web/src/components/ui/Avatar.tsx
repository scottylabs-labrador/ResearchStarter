import PersonIcon from "@mui/icons-material/Person";
import { cx } from "./cx";

type AvatarSize = "sm" | "md";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-[28px] w-[28px] text-[11px]",
  md: "h-[40px] w-[40px] text-[14px]",
};

const iconSizes: Record<AvatarSize, number> = { sm: 16, md: 22 };

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  /** Set when the name is shown beside the avatar, so screen readers don’t hear it twice. */
  decorative?: boolean;
  className?: string;
}

const Avatar = ({ name, src, size = "md", decorative = false, className }: AvatarProps) => {
  const initials = initialsOf(name);
  return (
    <span
      role={src || decorative ? undefined : "img"}
      aria-label={src || decorative ? undefined : name || "User"}
      aria-hidden={decorative || undefined}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface-muted font-medium leading-none tracking-[0.04em] text-ink-secondary",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={decorative ? "" : name} className="h-full w-full object-cover" />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <PersonIcon aria-hidden="true" sx={{ fontSize: iconSizes[size] }} className="text-ink-muted" />
      )}
    </span>
  );
};

export default Avatar;
