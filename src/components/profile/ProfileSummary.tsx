import React from "react";
import Avatar from "../ui/Avatar";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";
import { cx } from "../ui/cx";

interface ProfileSummaryProps {
  name: string;
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  rows: DetailRow[];
  avatarAction?: React.ReactNode;
  className?: string;
}

const ProfileSummary = ({ name, title, subtitle, avatarSrc, rows, avatarAction, className }: ProfileSummaryProps) => (
  <section className={cx("mx-auto w-full max-w-4xl", className)}>
    <div className="mb-6 flex items-center gap-6">
      <div className="relative shrink-0">
        <Avatar src={avatarSrc} name={name} size="lg" />
        {avatarAction ? <div className="absolute -bottom-1 -right-1">{avatarAction}</div> : null}
      </div>
      <div className="min-w-0">
        <h1 className="break-words text-title text-ink">{title ?? name}</h1>
        {subtitle ? <p className="mt-1 break-all font-mono text-meta text-ink-muted">{subtitle}</p> : null}
      </div>
    </div>
    <DetailsTable rows={rows} />
  </section>
);

export default ProfileSummary;
