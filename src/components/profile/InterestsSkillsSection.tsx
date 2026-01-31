import React, { useState } from "react";
import Tag from "../Tag";

interface InterestsSkillsSectionProps {
  items?: string[];
  onAddItem?: (item: string) => void;
  onRemoveItem?: (item: string) => void;
}

const InterestsSkillsSection = ({
  items = [],
  onAddItem,
  onRemoveItem,
}: InterestsSkillsSectionProps) => {
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
    <section className="mb-8 relative">
      <h2 className="text-xl font-bold mb-4">Interests & Skills</h2>

      <div className="grid grid-cols-5 gap-2 mb-4 max-h-72 overflow-y-auto bg-pink-hippo p-4 rounded-md">
        {items.map((item) => (
          <Tag key={item} keyword={item} className="w-64 h-16 flex items-center justify-center overflow-hidden whitespace-nowrap text-ellipsis" />
        ))}
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex items-center justify-center w-48 h-16 overflow-hidden whitespace-nowrap text-ellipsis"
        >
          + Add Item
        </button>
      </div>

      {showPopup && ( /* Single Add Item Popup */
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Add New Interest or Skill</h3>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new interest or skill..."
              className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InterestsSkillsSection;
