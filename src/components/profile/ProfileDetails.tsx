import React, { useEffect, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";

interface ProfileDetailsProps {
  major: string;
  class: string;
  colleges: string[];
  email: string;
  onMajorChange?: (major: string) => void;
}

const notSet = <span className="text-ink-muted">Not set</span>;

const ProfileDetails = ({ major, class: userClass, colleges, email, onMajorChange }: ProfileDetailsProps) => {
  const [editingMajor, setEditingMajor] = useState(false);
  const [majorValue, setMajorValue] = useState(major);

  useEffect(() => {
    if (!editingMajor) setMajorValue(major);
  }, [major, editingMajor]);

  const handleMajorSave = () => {
    setEditingMajor(false);
    const next = majorValue.trim();
    if (next !== major) onMajorChange?.(next);
  };

  const handleMajorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleMajorSave();
    if (e.key === "Escape") {
      setMajorValue(major);
      setEditingMajor(false);
    }
  };

  const majorCell = editingMajor ? (
    <Input
      inputSize="sm"
      aria-label="Major"
      value={majorValue}
      onChange={(e) => setMajorValue(e.target.value)}
      onBlur={handleMajorSave}
      onKeyDown={handleMajorKeyDown}
      autoFocus
      containerClassName="-my-1 w-full max-w-[280px]"
    />
  ) : (
    <span className="-my-1.5 flex w-full items-center justify-between gap-2">
      {majorValue || notSet}
      <IconButton size="sm" aria-label="Edit major" onClick={() => setEditingMajor(true)}>
        <EditOutlinedIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </span>
  );

  const rows: DetailRow[] = [
    { label: "Major", value: majorCell, icon: <SchoolOutlinedIcon sx={{ fontSize: 15 }} /> },
    { label: "Class", value: userClass || notSet, icon: <BadgeOutlinedIcon sx={{ fontSize: 15 }} /> },
    {
      label: "College",
      value: colleges.length > 0 ? colleges.join(", ") : notSet,
      icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 15 }} />,
    },
    {
      label: "Email",
      value: email ? (
        <a
          href={`mailto:${email}`}
          className="break-all rounded-[4px] font-mono text-meta text-accent underline decoration-accent/35 underline-offset-[3px] transition-colors duration-150 hover:text-accent-strong hover:decoration-accent-strong/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
        >
          {email}
        </a>
      ) : (
        notSet
      ),
      icon: <MailOutlinedIcon sx={{ fontSize: 15 }} />,
    },
  ];

  return <DetailsTable rows={rows} />;
};

export default ProfileDetails;
