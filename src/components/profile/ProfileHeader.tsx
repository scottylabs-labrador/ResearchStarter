import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import ProfileSummary from "./ProfileSummary";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";

interface ProfileHeaderProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  className?: string;
  onProfileImageChange?: (file: File) => void;
  onMajorChange?: (major: string) => void;
}

const ProfileHeader = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  className,
  onProfileImageChange,
  onMajorChange,
}: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingMajor, setEditingMajor] = useState(false);
  const [majorValue, setMajorValue] = useState(major || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onProfileImageChange?.(file);
    }
  };

  const handleMajorSave = () => {
    setEditingMajor(false);
    onMajorChange?.(majorValue);
  };

  const handleMajorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleMajorSave();
    if (e.key === "Escape") {
      setMajorValue(major || "");
      setEditingMajor(false);
    }
  };

  const displayImage = previewUrl || profileImage;

  const majorCell = editingMajor ? (
    <Input
      inputSize="sm"
      aria-label="Major"
      value={majorValue}
      onChange={(e) => setMajorValue(e.target.value)}
      onBlur={handleMajorSave}
      onKeyDown={handleMajorKeyDown}
      autoFocus
      containerClassName="w-full max-w-[280px]"
    />
  ) : (
    <span className="flex items-center gap-1">
      {majorValue || "Not set"}
      <IconButton size="sm" aria-label="Edit major" onClick={() => setEditingMajor(true)}>
        <EditOutlinedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </span>
  );

  return (
    <ProfileSummary
      className={className}
      name={name ?? ""}
      title={name || "Your Name"}
      subtitle={email || undefined}
      avatarSrc={displayImage}
      avatarAction={
        <>
          <IconButton size="sm" bordered aria-label="Edit profile picture" onClick={() => fileInputRef.current?.click()}>
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </>
      }
      rows={[
        { label: "Major", value: majorCell, icon: <SchoolOutlinedIcon sx={{ fontSize: 14 }} /> },
        { label: "Class", value: userClass || "Not set", icon: <BadgeOutlinedIcon sx={{ fontSize: 14 }} /> },
        { label: "Email", value: email ? <span className="font-mono">{email}</span> : "Not set", icon: <MailOutlinedIcon sx={{ fontSize: 14 }} /> },
      ]}
    />
  );
};

export default ProfileHeader;
