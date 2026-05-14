import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import { ResearchType } from '../../DataTypes';

interface InfoSidebarProps {
  info: ResearchType;
}

interface SidebarCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

interface FieldProps {
  label: string;
  value: string;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ info }) => {
  const hasDetails =
    info.position ||
    info.paidUnpaid ||
    info.timeCommitment ||
    info.desiredSkillLevel ||
    info.anticipatedEndDate ||
    (info.prereqs && info.prereqs.length > 0);

  const hasContact = info.contact && Object.keys(info.contact).length > 0;
  const hasLinks = info.relevantLinks && info.relevantLinks.length > 0;

  return (
    <aside className="space-y-4">
      {/* Details */}
      {hasDetails && (
        <SidebarCard icon={<InfoIcon fontSize="small" />} title="Details">
          <div className="space-y-4">
            {info.position && <Field label="Position" value={info.position} />}
            {info.paidUnpaid && <Field label="Compensation" value={info.paidUnpaid} />}
            {info.timeCommitment && (
              <Field label="Time commitment" value={`${info.timeCommitment} hrs / week`} />
            )}
            {info.desiredSkillLevel && (
              <Field label="Skill level" value={info.desiredSkillLevel} />
            )}
            {info.anticipatedEndDate && (
              <Field label="Anticipated end" value={info.anticipatedEndDate} />
            )}
            {info.prereqs && info.prereqs.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
                  Prerequisites
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  {info.prereqs.map((p) => (
                    <li key={p} className="text-sm text-gray-800">{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SidebarCard>
      )}

      {/* Contact */}
      {hasContact && (
        <SidebarCard icon={<MailIcon fontSize="small" />} title="Contact">
          <div className="space-y-3">
            {Object.entries(info.contact).map(([name, andrewId]) => (
              <div key={andrewId}>
                <p className="text-sm font-medium text-gray-900 mb-0.5">{name}</p>
                <a
                  href={`mailto:${andrewId}@andrew.cmu.edu`}
                  className="text-sm text-card-highlight hover:underline break-all"
                >
                  {andrewId}@andrew.cmu.edu
                </a>
              </div>
            ))}
          </div>
        </SidebarCard>
      )}

      {/* Relevant Links */}
      {hasLinks && (
        <SidebarCard icon={<LinkIcon fontSize="small" />} title="Relevant links">
          <div className="space-y-2">
            {info.relevantLinks!.map((link, i) => (
              <a
                key={i}
                href={link.startsWith('http') ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-card-highlight hover:underline break-all block"
              >
                {link}
              </a>
            ))}
          </div>
        </SidebarCard>
      )}
    </aside>
  );
};

const SidebarCard: React.FC<SidebarCardProps> = ({ icon, title, children }) => (
  <div className="bg-light-color rounded-lg p-5 border border-gray-200">
    <div className="flex items-center gap-2 mb-4">
      <span className="flex items-center text-gray-400">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-900 leading-none">{title}</h2>
    </div>
    {children}
  </div>
);

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

export default InfoSidebar;
