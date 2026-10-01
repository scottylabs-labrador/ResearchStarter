import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { FaBook } from "react-icons/fa6";
import { TbCoin } from "react-icons/tb";
import { CiCalendar } from "react-icons/ci";
import { ResearchType } from "../../DataTypes";
import Surface from "../ui/Surface";
import SectionLabel from "../ui/SectionLabel";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";

interface InfoSidebarProps {
  info: ResearchType;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ info }) => {
  const detailRows: DetailRow[] = [];
  if (info.position) detailRows.push({ label: "Position", value: info.position, icon: <FaBook size={12} /> });
  if (info.paidUnpaid) detailRows.push({ label: "Compensation", value: info.paidUnpaid, icon: <TbCoin size={14} /> });
  if (info.timeCommitment)
    detailRows.push({ label: "Time commitment", value: `${info.timeCommitment} hrs / week`, icon: <ScheduleOutlinedIcon sx={{ fontSize: 14 }} /> });
  if (info.desiredSkillLevel)
    detailRows.push({ label: "Skill level", value: info.desiredSkillLevel, icon: <SchoolOutlinedIcon sx={{ fontSize: 14 }} /> });
  if (info.anticipatedEndDate)
    detailRows.push({ label: "Anticipated end", value: info.anticipatedEndDate, icon: <CiCalendar size={14} /> });

  const prereqs = info.prereqs ?? [];
  const contacts = Object.entries(info.contact ?? {});
  const links = info.relevantLinks ?? [];

  return (
    <aside className="space-y-6">
      {detailRows.length > 0 || prereqs.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <InfoIcon sx={{ fontSize: 14 }} />
            Details
          </SectionLabel>
          {detailRows.length > 0 ? <DetailsTable rows={detailRows} /> : null}
          {prereqs.length > 0 ? (
            <Surface className="mt-3 p-4">
              <p className="mb-2 font-mono text-meta text-ink-muted">Prerequisites</p>
              <ul className="list-disc space-y-1 pl-4 text-small text-ink">
                {prereqs.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Surface>
          ) : null}
        </section>
      ) : null}

      {contacts.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <MailIcon sx={{ fontSize: 14 }} />
            Contact
          </SectionLabel>
          <Surface className="space-y-3 p-4">
            {contacts.map(([name, andrewId]) => (
              <div key={andrewId}>
                <p className="text-small font-medium text-ink">{name}</p>
                <a
                  href={`mailto:${andrewId}@andrew.cmu.edu`}
                  className="break-all font-mono text-meta text-ink-secondary underline-offset-2 hover:text-ink hover:underline"
                >
                  {andrewId}@andrew.cmu.edu
                </a>
              </div>
            ))}
          </Surface>
        </section>
      ) : null}

      {links.length > 0 ? (
        <section>
          <SectionLabel as="h2" className="mb-2">
            <LinkIcon sx={{ fontSize: 14 }} />
            Relevant links
          </SectionLabel>
          <Surface className="space-y-2 p-4">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.startsWith("http") ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-1.5 font-mono text-meta text-ink-secondary hover:text-ink hover:underline"
              >
                <span className="truncate">{link}</span>
                <OpenInNewOutlinedIcon sx={{ fontSize: 13 }} className="shrink-0" />
              </a>
            ))}
          </Surface>
        </section>
      ) : null}
    </aside>
  );
};

export default InfoSidebar;
