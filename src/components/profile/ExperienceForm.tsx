import React, { useState, useEffect } from "react";
import { Experience } from "../../types/Experience";
import Tag from "../Tag";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";

interface ExperienceFormProps {
  initialData: Omit<Experience, "id">;
  onChange: (data: Omit<Experience, "id">) => void;
}

const labelClass = "mb-1.5 block text-small font-medium text-ink";

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
        <label htmlFor="title" className={labelClass}>Title</label>
        <input type="text" id="title" className={fieldClass} placeholder="Enter position name/title" value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="professorOrCompany" className={labelClass}>Professor/Advisor name</label>
        <input type="text" id="professorOrCompany" className={fieldClass} placeholder="Enter professor/advisor name" value={formData.professorOrCompany} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="topic" className={labelClass}>Department/Area</label>
        <input type="text" id="topic" className={fieldClass} placeholder="Enter department/area" value={formData.topic} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="level" className={labelClass}>Education level</label>
        <select id="level" className={fieldClass} value={formData.level} onChange={handleChange}>
          <option value="">Select education level</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="Industry">Industry</option>
          <option value="High School">High School</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className={labelClass}>Start time</label>
        <input type="date" id="date" className={fieldClass} value={formData.date} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="endDate" className={labelClass}>End time</label>
        <input type="date" id="endDate" className={fieldClass} value={formData.endDate} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" rows={4} className={cx(fieldClass, "resize-y")} placeholder="Enter description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="skills" className={labelClass}>Skills</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {formData.associatedTags.map((tag) => (
            <Tag key={tag} keyword={tag} />
          ))}
          <input id="skills" type="text" className={cx(fieldClass, "h-[32px] w-auto py-1")} placeholder="+ Add skills" onKeyDown={handleTagsChange} />
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
