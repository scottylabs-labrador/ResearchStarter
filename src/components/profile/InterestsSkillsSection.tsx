import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AboutSection from "./AboutSection";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import { Meta } from "../ui/Meta";

interface InterestsSkillsSectionProps {
  items?: string[];
  onAddItem?: (item: string) => void;
  onRemoveItem?: (item: string) => void;
}

const chipButton =
  "inline-flex h-6 items-center gap-1 rounded-chip border border-dashed border-accent/30 px-2 text-small text-accent-strong transition-[background-color,color,border-color,transform] duration-150 ease-out hover:border-accent/50 hover:bg-accent-bg/60 hover:text-accent-strong active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const InterestsSkillsSection = ({ items = [], onAddItem, onRemoveItem }: InterestsSkillsSectionProps) => {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  const commit = () => {
    const value = newItem.trim();
    if (value && !items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onAddItem?.(value);
    }
    setNewItem("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      setNewItem("");
      setAdding(false);
    }
  };

  return (
    <AboutSection
      title="Interests and skills"
      action={items.length > 0 ? <Meta>{items.length} added</Meta> : null}
    >
      <Surface className="flex flex-wrap items-center gap-1.5 p-4">
        {items.map((item) => (
          <Tag key={item} keyword={item} onRemove={onRemoveItem ? () => onRemoveItem(item) : undefined} />
        ))}
        {adding ? (
          <input
            aria-label="New interest or skill"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              commit();
              setAdding(false);
            }}
            placeholder="Type and press Enter"
            autoFocus
            className="h-6 w-[180px] rounded-chip border border-accent bg-surface px-2 text-[16px] text-ink outline-none ring-2 ring-accent/15 placeholder:text-ink-muted sm:text-small"
          />
        ) : (
          <button type="button" className={chipButton} onClick={() => setAdding(true)}>
            <AddOutlinedIcon sx={{ fontSize: 14 }} />
            {items.length > 0 ? "Add" : "Add an interest or skill"}
          </button>
        )}
      </Surface>
    </AboutSection>
  );
};

export default InterestsSkillsSection;
