import React, { useState, useEffect } from "react";

interface ProfileHeaderProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // New prop to handle saving the text changes
  onSave?: (data: { name: string; major: string; class: string; email: string }) => void;
  className?: string;
}

const ProfileHeader = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  onImageUpload,
  onSave,
  className,
}: ProfileHeaderProps) => {
  const [internalProfileImage, setInternalProfileImage] = useState("");
  
  // State to toggle between View and Edit modes
  const [isEditing, setIsEditing] = useState(false);

  // State to hold form data while editing
  const [profileData, setProfileData] = useState({
    name: name || "",
    major: major || "",
    class: userClass || "",
    email: email || "",
  });

  // Sync state with props if data comes in asynchronously (e.g. from an API)
  useEffect(() => {
    setProfileData({
      name: name || "",
      major: major || "",
      class: userClass || "",
      email: email || "",
    });
  }, [name, major, userClass, email]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onImageUpload) {
      onImageUpload(event);
    } else {
      const file = event.target.files![0];
      if (file) {
        const imageURL = URL.createObjectURL(file);
        setInternalProfileImage(imageURL);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(profileData);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Revert changes to original props
    setProfileData({
      name: name || "",
      major: major || "",
      class: userClass || "",
      email: email || "",
    });
    setIsEditing(false);
  };

  return (
    <section className={className}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Profile Image Section */}
        <div className="relative">
          <img
            src={
              profileImage ||
              internalProfileImage ||
              "https://via.placeholder.com/150?text=Upload+Image"
            }
            alt="Profile"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-gray-300"
          />
          {/* Upload Button */}
          <label
            htmlFor="imageUpload"
            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition"
          >
            📷
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center w-full max-w-md">
          {isEditing ? (
            // --- EDIT MODE ---
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full text-2xl font-bold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Major</label>
                <input
                  type="text"
                  name="major"
                  value={profileData.major}
                  onChange={handleInputChange}
                  className="w-full text-lg border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Class</label>
                <input
                  type="text"
                  name="class"
                  value={profileData.class}
                  onChange={handleInputChange}
                  className="w-full text-lg border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full text-lg border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                />
              </div>
              
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSaveClick}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // --- VIEW MODE ---
            <div className="relative group">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {profileData.name || "Your Name"}
              </h1>
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">Major:</span> {profileData.major || "Not set"}
              </p>
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">Class:</span> {profileData.class || "Not set"}
              </p>
              <p className="text-gray-600 text-lg">
                <span className="font-semibold">Email:</span> {profileData.email || "Not set"}
              </p>

              {/* Edit Button (Visible on hover or always visible depending on preference) */}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 text-blue-500 hover:text-blue-700 underline text-sm flex items-center gap-1"
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;