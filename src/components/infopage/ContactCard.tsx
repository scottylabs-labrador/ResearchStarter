import React from "react";
import Surface from "../ui/Surface";
import Avatar from "../ui/Avatar";
import { cx } from "../ui/cx";
import { linkHoverUnderline } from "../ui/linkClass";

interface ContactCardProps {
  headshotUrl: string;
  title: string;
  department: string;
  officeLocation: string;
  email: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ headshotUrl, title, department, officeLocation, email }) => (
  <Surface className="flex w-[260px] shrink-0 flex-col gap-3 p-4">
    <div className="flex items-center gap-3">
      <Avatar src={headshotUrl || undefined} name={title} size="md" />
      <div className="min-w-0">
        <p className="truncate text-body font-medium text-ink">{title}</p>
        {department ? <p className="truncate text-small text-ink-secondary">{department}</p> : null}
        {officeLocation ? <p className="truncate text-small text-ink-muted">{officeLocation}</p> : null}
      </div>
    </div>
    <a
      href={`mailto:${email}`}
      className={cx(linkHoverUnderline, "truncate border-t border-hairline pt-3 font-mono text-meta text-ink-secondary hover:text-ink")}
    >
      {email}
    </a>
  </Surface>
);

export default ContactCard;
