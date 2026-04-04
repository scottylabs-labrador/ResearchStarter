import React, { useState, useRef } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonIcon from "@mui/icons-material/Person";

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

  return (
    <section className={className}>
      <div className="flex flex-row items-start gap-24 max-w-4xl w-full mx-auto">
        {/* Profile Image Section */}
        <div className="relative w-48 h-48 flex-shrink-0 group">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <PersonIcon style={{ fontSize: "5rem" }} className="text-gray-400" />
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Edit profile picture"
          >
            <EditOutlinedIcon fontSize="small" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col pt-2">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            {name || "Your Name"}
          </h1>
          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl items-center">
            <span className="font-bold text-gray-900">Major</span>
            <div className="flex items-center gap-2">
              {editingMajor ? (
                <input
                  type="text"
                  value={majorValue}
                  onChange={(e) => setMajorValue(e.target.value)}
                  onBlur={handleMajorSave}
                  onKeyDown={handleMajorKeyDown}
                  autoFocus
                  className="text-gray-800 border border-gray-300 rounded px-2 py-1 text-xl focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              ) : (
                <>
                  <span className="text-gray-800">{majorValue || "Not set"}</span>
                  <button
                    onClick={() => setEditingMajor(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Edit major"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                </>
              )}
            </div>

            <span className="font-bold text-gray-900">Class</span>
            <span className="text-gray-800">{userClass || "Not set"}</span>

            <span className="font-bold text-gray-900">Email</span>
            <span className="text-gray-700">{email || "Not set"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;