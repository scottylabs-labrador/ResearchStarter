import PersonIcon from "@mui/icons-material/Person";
import { cx } from "./cx";

type AvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-[28px] w-[28px] text-[11px]",
  md: "h-[40px] w-[40px] text-[14px]",
  lg: "h-[96px] w-[96px] text-[30px]",
};

const iconSizes: Record<AvatarSize, number> = { sm: 16, md: 22, lg: 48 };

const initialsOf = (name: string) =>
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
  className?: string;
}

const Avatar = ({ name, src, size = "md", className }: AvatarProps) => {
  const initials = initialsOf(name);
  return (
    <span
      role={src ? undefined : "img"}
      aria-label={src ? undefined : name || "User"}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface-muted font-medium leading-none tracking-[0.04em] text-ink-secondary",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <PersonIcon aria-hidden="true" sx={{ fontSize: iconSizes[size] }} className="text-ink-muted" />
      )}
    </span>
  );
};

export default Avatar;
