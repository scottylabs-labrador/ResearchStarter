import React, { useState, useEffect } from "react";
import { ResearchOpportunity } from "../../types/ResearchOpportunity";
import { collegeOptions, departmentOptions } from "../../FilterData";

interface OpportunityFormProps {
  initialData: Omit<ResearchOpportunity, "id">;
  onChange: (data: Omit<ResearchOpportunity, "id">) => void;
}

const educationOptions = [
  "Undergraduate",
  "Graduate",
  "PhD",
  "Post-Doc",
  "High School",
];

const compensationOptions = [
  "Paid",
  "Unpaid",
  "Course Credit",
  "Stipend",
];

const locationOptions = [
  "In-Person",
  "Remote",
  "Hybrid",
];

const semesterOptions = [
  "Fall 2025",
  "Spring 2026",
  "Summer 2026",
  "Fall 2026",
  "Spring 2027",
  "Summer 2027",
  "Fall 2027",
  "Spring 2028",
  "Summer 2028",
  "Fall 2028",
  "Spring 2029",
  "Summer 2029",
  "Fall 2029",
  "Spring 2030",
];

const majorOptions = [
  "Computer Science",
  "Electrical & Computer Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Biological Sciences",
  "Physics",
  "Chemistry",
  "Mathematical Sciences",
  "Statistics & Data Science",
  "Information Systems",
  "Design",
  "Architecture",
  "Psychology",
  "Economics",
  "English",
  "History",
  "Philosophy",
  "Business Administration",
];

const OpportunityForm: React.FC<OpportunityFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<Omit<ResearchOpportunity, "id">>(initialData);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [id]: value };
      onChange(newState);
      return newState;
    });
  };

  const handleToggle = (field: "limitVisibility" | "allowDirectApplications") => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: !prev[field] };
      onChange(newState);
      return newState;
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() === "") return;
    setFormData((prev) => {
      const updatedSkills = [...prev.requiredSkills, skillInput.trim()];
      const newState = { ...prev, requiredSkills: updatedSkills };
      onChange(newState);
      return newState;
    });
    setSkillInput("");
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    setFormData((prev) => {
      const updatedSkills = prev.requiredSkills.filter((tag) => tag !== tagToRemove);
      const newState = { ...prev, requiredSkills: updatedSkills };
      onChange(newState);
      return newState;
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-5">
      {/* Position Title */}
      <div>
        <label htmlFor="positionTitle" className="block text-sm font-bold text-gray-900 mb-1">
          Position Title
        </label>
        <input
          type="text"
          id="positionTitle"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Position Name/Title"
          value={formData.positionTitle}
          onChange={handleChange}
        />
      </div>

      {/* College */}
      <div>
        <label htmlFor="college" className="block text-sm font-bold text-gray-900 mb-1">
          College
        </label>
        <select
          id="college"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.college}
          onChange={handleChange}
        >
          <option value="">Select College</option>
          {collegeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Department/Area */}
      <div>
        <label htmlFor="departmentArea" className="block text-sm font-bold text-gray-900 mb-1">
          Department/Area
        </label>
        <select
          id="departmentArea"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.departmentArea}
          onChange={handleChange}
        >
          <option value="">Select Department /Area</option>
          {departmentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Education Requirement */}
      <div>
        <label htmlFor="educationRequirement" className="block text-sm font-bold text-gray-900 mb-1">
          Education Requirement
        </label>
        <select
          id="educationRequirement"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.educationRequirement}
          onChange={handleChange}
        >
          <option value="">Select Education Requirement</option>
          {educationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Compensation Type */}
      <div>
        <label htmlFor="compensationType" className="block text-sm font-bold text-gray-900 mb-1">
          Compensation Type
        </label>
        <select
          id="compensationType"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.compensationType}
          onChange={handleChange}
        >
          <option value="">Select Compensation Type</option>
          {compensationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-1">
          Location
        </label>
        <select
          id="location"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.location}
          onChange={handleChange}
        >
          <option value="">Select Location Type</option>
          {locationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Start Semester */}
      <div>
        <label htmlFor="startSemester" className="block text-sm font-bold text-gray-900 mb-1">
          Start Semester
        </label>
        <select
          id="startSemester"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.startSemester}
          onChange={handleChange}
        >
          <option value="">Select Start Time</option>
          {semesterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Predicted End Semester */}
      <div>
        <label htmlFor="predictedEndSemester" className="block text-sm font-bold text-gray-900 mb-1">
          Predicted End Semester
        </label>
        <select
          id="predictedEndSemester"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.predictedEndSemester}
          onChange={handleChange}
        >
          <option value="">Select End Time</option>
          {semesterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Limit Visibility */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <label className="block text-sm font-bold text-gray-900">Limit Visibility</label>
          <button
            type="button"
            onClick={() => handleToggle("limitVisibility")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.limitVisibility ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.limitVisibility ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <select
          id="limitMajor"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
          value={formData.limitMajor}
          onChange={handleChange}
          disabled={!formData.limitVisibility}
        >
          <option value="">Select Majors to Limit Visibility To</option>
          {majorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-bold text-gray-900 mb-1">
          Website
        </label>
        <input
          type="text"
          id="website"
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Website if needed"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Department/Area"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Required/Recommended Skills */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1">
          Required/Recommended Skills
        </label>
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 items-center">
            {formData.requiredSkills.map((tag) => (
              <span
                key={tag}
                onClick={() => handleRemoveSkill(tag)}
                className="bg-purple-200 text-purple-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-purple-300"
              >
                {tag}
              </span>
            ))}
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-purple-600"
            >
              + Add Skills
            </button>
          </div>
          <input
            type="text"
            className="mt-2 block w-full p-2 border-0 focus:ring-0 text-sm"
            placeholder="Type a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default OpportunityForm;
