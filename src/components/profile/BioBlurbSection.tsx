
import React, { useState, useEffect } from 'react';
import { FaPencil } from "react-icons/fa6";

interface BioBlurbSectionProps {
  initialBio?: string;
  onSave?: (bio: string) => void;
}

const BioBlurbSection: React.FC<BioBlurbSectionProps> = ({
  initialBio = "",
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBio, setCurrentBio] = useState(initialBio);

  useEffect(() => {
    setCurrentBio(initialBio);
  }, [initialBio]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveBio = () => {
    if (onSave) {
      onSave(currentBio);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentBio(initialBio);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentBio(e.target.value);
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-jersey text-3xl font-semibold text-gray-800">Bio</h2>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Edit bio"
          >
            <FaPencil size={18} />
          </button>
        )}
      </div>
      <div className="bg-magenta-100 p-4 rounded-md">
        {isEditing ? (
          <>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              rows={5}
              value={currentBio}
              onChange={handleChange}
              autoFocus
            ></textarea>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {initialBio || "No bio yet. Click edit to add one."}
          </p>
        )}
      </div>
    </section>
  );
};

export default BioBlurbSection;
