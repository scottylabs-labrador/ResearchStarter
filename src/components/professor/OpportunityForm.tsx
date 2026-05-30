import React, { useState, useEffect } from "react";
import { ResearchOpportunity } from "../../types/ResearchOpportunity";
import { collegeOptions, departmentOptions } from "../../FilterData";

type FormData = Omit<ResearchOpportunity, "source" | "timeAdded" | "enableApply">;

interface OpportunityFormProps {
  initialData: FormData;
  onChange: (data: FormData) => void;
}


const paidOptions = ["Paid", "Unpaid"];

const inputClass =
  "block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500";
const labelClass = "block text-sm font-bold text-gray-900 mb-1";

interface TagsFieldProps {
  label: string;
  tags: string[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (t: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const TagsField: React.FC<TagsFieldProps> = ({
  label,
  tags,
  input,
  onInputChange,
  onAdd,
  onRemove,
  onKeyDown,
  placeholder,
}) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className="border border-gray-300 rounded-lg p-3">
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            onClick={() => onRemove(tag)}
            className="bg-purple-200 text-purple-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-purple-300"
          >
            {tag} ×
          </span>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="bg-card-highlight text-white text-sm font-medium px-3 py-1 rounded-full transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
        >
          + Add
        </button>
      </div>
      <input
        type="text"
        className="mt-2 block w-full p-2 border-0 focus:ring-0 text-sm"
        placeholder={placeholder}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  </div>
);

const OpportunityForm: React.FC<OpportunityFormProps> = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [prereqInput, setPrereqInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [contactKey, setContactKey] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [contactEmailError, setContactEmailError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleContactValueChange = (v: string) => {
    setContactValue(v);
    setContactEmailError(v && !EMAIL_REGEX.test(v) ? "Please enter a valid email address." : "");
  };

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const update = (updates: Partial<FormData>) => {
    setFormData((prev) => {
      const newState = { ...prev, ...updates };
      onChange(newState);
      return newState;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    update({ [id]: value } as Partial<FormData>);
  };

  const addTag = (
    field: "prereqs" | "relevantLinks" | "keywords",
    value: string,
    clear: () => void
  ) => {
    if (!value.trim()) return;
    update({ [field]: [...formData[field], value.trim()] });
    clear();
  };

  const removeTag = (field: "prereqs" | "relevantLinks" | "keywords", tag: string) => {
    update({ [field]: formData[field].filter((t) => t !== tag) });
  };

  const addContact = () => {
    if (!contactKey.trim() || !contactValue.trim()) return;
    if (!EMAIL_REGEX.test(contactValue.trim())) {
      setContactEmailError("Please enter a valid email address.");
      return;
    }
    update({ contact: { ...formData.contact, [contactKey.trim()]: contactValue.trim() } });
    setContactKey("");
    setContactValue("");
    setContactEmailError("");
  };

  const removeContact = (key: string) => {
    const updated = { ...formData.contact };
    delete updated[key];
    update({ contact: updated });
  };

  const toggleArrayField = (field: "colleges" | "department", value: string) => {
    const current = formData[field];
    if (current.includes(value)) {
      update({ [field]: current.filter((v) => v !== value) });
    } else {
      update({ [field]: [...current, value] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Project Title */}
      <div>
        <label htmlFor="projectTitle" className={labelClass}>
          <span className="text-red-500">*</span> Project Title
        </label>
        <input
          type="text"
          id="projectTitle"
          className={inputClass}
          placeholder="Enter project title"
          value={formData.projectTitle}
          onChange={handleChange}
        />
      </div>

      {/* Contact */}
      <div>
        <label className={labelClass}><span className="text-red-500">*</span> Contact</label>
        <div className="border border-gray-300 rounded-lg p-3 space-y-2">
          {Object.entries(formData.contact).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5"
            >
              <span className="text-sm">
                <span className="font-medium">{key}:</span> {value}
              </span>
              <button
                type="button"
                onClick={() => removeContact(key)}
                className="text-red-400 hover:text-red-600 ml-2 text-sm leading-none"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-1 items-start">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-200 rounded text-sm"
              placeholder="Full Name"
              value={contactKey}
              onChange={(e) => setContactKey(e.target.value)}
            />
            <div className="flex-1 flex flex-col">
              <input
                type="text"
                className={`p-2 border rounded text-sm ${contactEmailError ? "border-red-400 focus:border-red-400" : "border-gray-200"}`}
                placeholder="Email"
                value={contactValue}
                onChange={(e) => handleContactValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addContact();
                  }
                }}
              />
              {contactEmailError && (
                <span className="text-red-500 text-xs mt-1">{contactEmailError}</span>
              )}
            </div>
            <button
              type="button"
              onClick={addContact}
              className="bg-purple-500 text-white text-sm px-3 py-1 rounded-full hover:bg-purple-600 whitespace-nowrap"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Colleges */}
      <div>
        <label className={labelClass}><span className="text-red-500">*</span> Colleges</label>
        <div className="border border-gray-300 focus-within:border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.colleges.map((c) => (
              <span
                key={c}
                onClick={() => toggleArrayField("colleges", c)}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200"
              >
                {c} ×
              </span>
            ))}
          </div>
          <select
            className="block w-full p-2 border border-gray-200 rounded text-sm text-gray-500"
            value=""
            onChange={(e) => {
              if (e.target.value) toggleArrayField("colleges", e.target.value);
            }}
          >
            <option value="">Select a college</option>
            {collegeOptions
              .filter((opt) => !formData.colleges.includes(opt.value))
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Department */}
      <div>
        <label className={labelClass}><span className="text-red-500">*</span> Department</label>
        <div className="border border-gray-300 focus-within:border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.department.map((d) => (
              <span
                key={d}
                onClick={() => toggleArrayField("department", d)}
                className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-green-200"
              >
                {d} ×
              </span>
            ))}
          </div>
          <select
            className="block w-full p-2 border border-gray-200 rounded text-sm text-gray-500"
            value=""
            onChange={(e) => {
              if (e.target.value) toggleArrayField("department", e.target.value);
            }}
          >
            <option value="">Select a department</option>
            {departmentOptions
              .filter((opt) => !formData.department.includes(opt.value))
              .map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          <span className="text-red-500">*</span> Description
        </label>
        <textarea
          id="description"
          rows={5}
          className={inputClass}
          placeholder="Describe the research opportunity"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Desired Skill Level */}
      <div>
        <label htmlFor="desiredSkillLevel" className={labelClass}>
          Desired Skill Level
        </label>
        <input
          type="text"
          id="desiredSkillLevel"
          className={inputClass}
          placeholder="e.g. Undergraduate Students, Masters Students"
          value={formData.desiredSkillLevel}
          onChange={handleChange}
        />
      </div>

      {/* Paid/Unpaid */}
      <div>
        <label htmlFor="paidUnpaid" className={labelClass}>
          <span className="text-red-500">*</span> Paid/Unpaid
        </label>
        <select
          id="paidUnpaid"
          className={`${inputClass} text-gray-500`}
          value={formData.paidUnpaid}
          onChange={handleChange}
        >
          <option value="">Select compensation type</option>
          {paidOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Position */}
      <div>
        <label htmlFor="position" className={labelClass}>
          <span className="text-red-500">*</span> Position
        </label>
        <input
          type="text"
          id="position"
          className={inputClass}
          placeholder="e.g. Independent Study"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

      {/* Prerequisites */}
      <TagsField
        label="Prerequisites"
        tags={formData.prereqs}
        input={prereqInput}
        onInputChange={setPrereqInput}
        onAdd={() => addTag("prereqs", prereqInput, () => setPrereqInput(""))}
        onRemove={(t) => removeTag("prereqs", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("prereqs", prereqInput, () => setPrereqInput(""));
          }
        }}
        placeholder="e.g. Machine Learning with Python"
      />

      {/* Relevant Links */}
      <TagsField
        label="Relevant Links"
        tags={formData.relevantLinks}
        input={linkInput}
        onInputChange={setLinkInput}
        onAdd={() => addTag("relevantLinks", linkInput, () => setLinkInput(""))}
        onRemove={(t) => removeTag("relevantLinks", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("relevantLinks", linkInput, () => setLinkInput(""));
          }
        }}
        placeholder="e.g. https://www.scottylabs.org/"
      />

      {/* Time Commitment */}
      <div>
        <label htmlFor="timeCommitment" className={labelClass}>
          Time Commitment (hrs/week)
        </label>
        <input
          type="number"
          id="timeCommitment"
          className={inputClass}
          placeholder="e.g. 5"
          min="0"
          step="1"
          value={formData.timeCommitment}
          onChange={(e) => update({ timeCommitment: Math.trunc(Math.max(0, Number(e.target.value))).toString() })}
        />
      </div>

      {/* Anticipated End Date */}
      <div>
        <label htmlFor="anticipatedEndDate" className={labelClass}>
          <span className="text-red-500">*</span> Anticipated End Date
        </label>
        <input
          type="text"
          id="anticipatedEndDate"
          className={inputClass}
          placeholder="e.g. May 2026"
          value={formData.anticipatedEndDate}
          onChange={handleChange}
        />
      </div>

      {/* Keywords */}
      <TagsField
        label="Keywords"
        tags={formData.keywords}
        input={keywordInput}
        onInputChange={setKeywordInput}
        onAdd={() => addTag("keywords", keywordInput, () => setKeywordInput(""))}
        onRemove={(t) => removeTag("keywords", t)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("keywords", keywordInput, () => setKeywordInput(""));
          }
        }}
        placeholder="e.g. Computer Vision"
      />
    </div>
  );
};

export default OpportunityForm;
