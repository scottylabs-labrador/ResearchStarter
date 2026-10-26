import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { initialsOf } from "../ui/Avatar";
import Badge from "../ui/Badge";
import { CheckCircleIcon } from "../ui/icons";

interface ProfileHeaderProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  /** Overrides the major/class summary line when set. */
  summary?: string;
  readOnly?: boolean;
  completedSteps?: number;
  totalSteps?: number;
  className?: string;
  onProfileImageChange?: (file: File) => void;
  /** Page actions, in a row under the summary. Put the primary action first. */
  action?: React.ReactNode;
}

const avatarShellClass =
  "relative block h-[64px] w-[64px] rounded-[18px] border border-accent/20 bg-accent-bg/40 p-[3px] shadow-[0_1px_2px_rgb(72_107_132/0.08)]";

const ProfileHeader = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  summary,
  readOnly = false,
  completedSteps,
  totalSteps,
  className,
  onProfileImageChange,
  action,
}: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onProfileImageChange?.(file);
    }
  };

  const displayImage = previewUrl || profileImage;
  const displayName = name || "Your name";
  const displaySummary =
    summary ??
    ([major, userClass].filter(Boolean).join(" · ") ||
      email ||
      "Add your major and class so professors know where you’re coming from.");
  const showProgress = completedSteps !== undefined && totalSteps !== undefined;
  const isComplete = showProgress && completedSteps >= totalSteps;

  const avatarInner = (
    <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-surface-muted">
      {displayImage ? (
        <img src={displayImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true" className="text-[20px] font-semibold leading-none tracking-[0.04em] text-ink-secondary">
          {initialsOf(name ?? "") || "?"}
        </span>
      )}
      {!readOnly ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-ink/45 text-white opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <PhotoCameraOutlinedIcon sx={{ fontSize: 20 }} />
        </span>
      ) : null}
    </span>
  );

  return (
    <header className={className}>
      {readOnly ? (
        <div className={avatarShellClass}>{avatarInner}</div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile photo"
            className={`group ${avatarShellClass} transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas`}
          >
            {avatarInner}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-hairline-strong bg-surface text-ink-muted shadow-[0_1px_2px_rgb(24_24_27/0.08)]"
            >
              <EditOutlinedIcon sx={{ fontSize: 12 }} />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <h1 className="break-words text-title text-ink">{displayName}</h1>
        {showProgress ? (
          isComplete ? (
            <Badge tone="positive" icon={<CheckCircleIcon size={11} />}>
              Profile complete
            </Badge>
          ) : (
            <Badge tone="accent">
              {completedSteps} of {totalSteps} complete
            </Badge>
          )
        ) : null}
      </div>
      <p className="mt-1 text-lead text-ink-muted">{displaySummary}</p>
      {action ? <div className="mt-5 flex flex-wrap items-center gap-2">{action}</div> : null}
    </header>
  );
};

export default ProfileHeader;
