import { ResearchType } from "../../DataTypes";
import { contactEmail } from "../../lib/opportunities";
import Avatar from "../ui/Avatar";
import Surface from "../ui/Surface";
import SectionLabel from "../ui/SectionLabel";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";
import { cx } from "../ui/cx";
import { CalendarIcon, MenuBookIcon, PaidIcon, ScheduleIcon, SchoolIcon } from "../ui/icons";
import { linkHoverUnderline } from "../ui/linkClass";

// The info page's side column: the listing's facts and who to contact.

interface InfoDetailsProps {
  info: ResearchType;
  className?: string;
}

export const InfoDetails = ({ info, className }: InfoDetailsProps) => {
  const rows: DetailRow[] = [];
  if (info.position) rows.push({ label: "Position", value: info.position, icon: <MenuBookIcon size={10.5} /> });
  if (info.paidUnpaid) rows.push({ label: "Compensation", value: info.paidUnpaid, icon: <PaidIcon size={12} /> });
  if (info.timeCommitment)
    rows.push({ label: "Time commitment", value: `${info.timeCommitment} hrs / week`, icon: <ScheduleIcon size={12} /> });
  if (info.desiredSkillLevel) rows.push({ label: "Skill level", value: info.desiredSkillLevel, icon: <SchoolIcon size={11} /> });
  if (info.anticipatedEndDate)
    rows.push({ label: "Anticipated end", value: info.anticipatedEndDate, icon: <CalendarIcon size={12} /> });
  if (rows.length === 0) return null;

  return (
    <section className={className}>
      <SectionLabel as="h2" className="mb-2">
        Details
      </SectionLabel>
      <DetailsTable rows={rows} />
    </section>
  );
};

interface InfoContactProps {
  contact: ResearchType["contact"];
  className?: string;
}

export const InfoContact = ({ contact, className }: InfoContactProps) => {
  const contacts = Object.entries(contact ?? {});
  if (contacts.length === 0) return null;

  return (
    <section className={className}>
      <SectionLabel as="h2" className="mb-2">
        Contact
      </SectionLabel>
      <Surface className="divide-y divide-hairline">
        {contacts.map(([name, andrewId]) => (
          <div key={andrewId} className="flex items-center gap-3 px-4 py-3">
            <Avatar name={name} decorative />
            <div className="min-w-0">
              <p className="truncate text-body font-medium text-ink">{name}</p>
              <a
                href={`mailto:${contactEmail(andrewId)}`}
                className={cx(linkHoverUnderline, "block truncate font-mono text-meta text-ink-secondary hover:text-ink")}
              >
                {contactEmail(andrewId)}
              </a>
            </div>
          </div>
        ))}
      </Surface>
    </section>
  );
};
