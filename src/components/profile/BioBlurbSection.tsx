// Currently an unused feature for the student dashboard.

import React, { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";

interface BioBlurbSectionProps {
  initialBio?: string;
  onSave?: (bio: string) => void;
}

const BioBlurbSection: React.FC<BioBlurbSectionProps> = ({ initialBio = "", onSave }) => {
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
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-1">
        <h2 className="text-heading text-ink">Bio</h2>
        {!isEditing ? (
          <IconButton size="sm" aria-label="Edit bio" onClick={handleEditClick}>
            <FaPencil size={13} />
          </IconButton>
        ) : null}
      </div>
      <Surface className="p-4">
        {isEditing ? (
          <>
            <textarea
              aria-label="Bio"
              className={cx(fieldClass, "resize-none")}
              rows={5}
              value={currentBio}
              onChange={handleChange}
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveBio}>
                Save
              </Button>
            </div>
          </>
        ) : (
          <p className="whitespace-pre-wrap text-body text-ink-secondary">
            {initialBio || "No bio yet. Click edit to add one."}
          </p>
        )}
      </Surface>
    </section>
  );
};

export default BioBlurbSection;
