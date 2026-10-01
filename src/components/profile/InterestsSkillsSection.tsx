// Currently an unused feature for the student dashboard.

import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

interface InterestsSkillsSectionProps {
  items?: string[];
  onAddItem?: (item: string) => void;
  onRemoveItem?: (item: string) => void;
}

const InterestsSkillsSection = ({ items = [], onAddItem }: InterestsSkillsSectionProps) => {
  const [newItem, setNewItem] = useState(""); // Single state for new item
  const [showPopup, setShowPopup] = useState(false); // Single state for popup

  const handleAddItem = () => {
    if (newItem.trim() !== "" && onAddItem) {
      onAddItem(newItem.trim());
      setNewItem("");
      setShowPopup(false);
    }
  };

  return (
    <section className="relative mb-8">
      <h2 className="mb-3 text-heading text-ink">Interests &amp; Skills</h2>

      <Surface className="scrollbar-minimal flex max-h-72 flex-wrap items-center gap-1.5 overflow-y-auto p-4">
        {items.map((item) => (
          <Tag key={item} keyword={item} />
        ))}
        <Button size="sm" icon={<AddOutlinedIcon sx={{ fontSize: 14 }} />} onClick={() => setShowPopup(true)}>
          Add item
        </Button>
      </Surface>

      {showPopup ? (
        <Modal
          title="Add a new interest or skill"
          footer={
            <>
              <Button onClick={() => setShowPopup(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddItem}>
                Add
              </Button>
            </>
          }
        >
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter new interest or skill..."
            aria-label="New interest or skill"
            autoFocus
          />
        </Modal>
      ) : null}
    </section>
  );
};

export default InterestsSkillsSection;
