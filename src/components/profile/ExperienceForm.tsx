import React, { useState, useEffect } from "react";
import { Experience } from "../../types/Experience";

interface ExperienceFormProps {
  initialData: Omit<Experience, "id">;
  onChange: (data: Omit<Experience, "id">) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<Omit<Experience, "id">>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [id]: value };
      onChange(newState);
      return newState;
    });
  };

  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      const newTag = e.currentTarget.value.trim();
      setFormData((prev) => {
        const updatedTags = [...(prev.associatedTags || []), newTag];
        const newState = { ...prev, associatedTags: updatedTags };
        onChange(newState);
        return newState;
      });
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Position Name/Title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="professorOrCompany" className="block text-lg font-medium text-gray-700">Professor/Advisor Name</label>
        <input
          type="text"
          id="professorOrCompany"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Professor/Advisor Name"
          value={formData.professorOrCompany}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="topic" className="block text-lg font-medium text-gray-700">Department/Area</label>
        <input
          type="text"
          id="topic"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Department/Area"
          value={formData.topic}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="level" className="block text-lg font-medium text-gray-700">Education Level</label>
        <select
          id="level"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.level}
          onChange={handleChange}
        >
          <option value="">Select Education Level</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="Industry">Industry</option>
          <option value="High School">High School</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-lg font-medium text-gray-700">Start Time</label>
        <input
          type="date"
          id="date"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="endTime" className="block text-lg font-medium text-gray-700">End Time</label>
        <input
          type="date"
          id="endTime"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label htmlFor="skills" className="block text-lg font-medium text-gray-700">Skills</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.associatedTags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-200 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          <input
            type="text"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="+ Add Skills"
            onKeyDown={handleTagsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
