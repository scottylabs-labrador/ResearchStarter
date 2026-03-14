import React from "react";

interface ProfileHeaderProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  className?: string;
}

const ProfileHeader = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  className,
}: ProfileHeaderProps) => {
  return (
    <section className={className}>
      <div className="flex flex-row items-start gap-24 max-w-4xl w-full mx-auto">
        {/* Profile Image Section */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <img
            src={profileImage || "https://via.placeholder.com/150?text=Profile+Image"}
            alt="Profile"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col pt-2">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            {name || "Your Name"}
          </h1>
          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl">
            <span className="font-bold text-gray-900">Major</span>
            <span className="text-gray-800">{major || "Not set"}</span>

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