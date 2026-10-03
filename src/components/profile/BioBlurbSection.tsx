import React, { useState, useEffect } from "react";
import AboutSection from "./AboutSection";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";
import { AddIcon, EditIcon } from "../ui/icons";

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

  const handleSaveBio = () => {
    onSave?.(currentBio.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentBio(initialBio);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") handleCancel();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSaveBio();
  };

  const canEdit = Boolean(onSave);
  const editAction =
    canEdit && !isEditing && initialBio ? (
      <Button size="sm" variant="ghost" className="-my-1 -me-3" icon={<EditIcon size={12.5} />} onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    ) : null;

  return (
    <AboutSection title="Bio" action={editAction}>
      {isEditing ? (
        <Surface className="p-4">
          <textarea
            aria-label="Bio"
            className={cx(fieldClass, "resize-none text-lead")}
            rows={5}
            value={currentBio}
            onChange={(e) => setCurrentBio(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to research, and what have you worked on so far?"
            autoFocus
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="hidden font-mono text-meta text-ink-muted sm:inline">Ctrl + Enter to save</span>
            <div className="ml-auto flex gap-2">
              <Button size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveBio}>
                Save
              </Button>
            </div>
          </div>
        </Surface>
      ) : initialBio ? (
        <Surface className="px-5 py-4">
          <p className="w-full whitespace-pre-wrap text-lead text-ink-secondary">{initialBio}</p>
        </Surface>
      ) : canEdit ? (
        <Surface className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-ink-muted">A few sentences on what you want to research helps professors say yes.</p>
          <Button size="sm" icon={<AddIcon size={9} />} onClick={() => setIsEditing(true)}>
            Add bio
          </Button>
        </Surface>
      ) : (
        <Surface className="px-5 py-4">
          <p className="text-body text-ink-muted">No bio available.</p>
        </Surface>
      )}
    </AboutSection>
  );
};

export default BioBlurbSection;
