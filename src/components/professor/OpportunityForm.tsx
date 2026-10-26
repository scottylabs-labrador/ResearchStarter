import React, { useState, useEffect, useId } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ResearchOpportunity } from "../../types/ResearchOpportunity";
import { collegeOptions, departmentOptions } from "../../FilterData";
import Tag from "../Tag";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { fieldClass } from "../ui/Input";
import { cx } from "../ui/cx";
import { AddIcon } from "../ui/icons";

type FormData = Omit<ResearchOpportunity, "source" | "timeAdded" | "enableApply">;

interface OpportunityFormProps {
  initialData: FormData;
  onChange: (data: FormData) => void;
}

const paidOptions = ["Paid", "Unpaid"];

const labelClass = "mb-1.5 block text-small font-medium text-ink";
const boxClass =
  "rounded-control border border-hairline-strong bg-surface p-3 transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15";

const Required = () => (
  <span aria-hidden="true" className="mr-1 text-ink-muted">
    *
  </span>
);

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

const TagsField: React.FC<TagsFieldProps> = ({ label, tags, input, onInputChange, onAdd, onRemove, onKeyDown, placeholder }) => {
  const inputId = useId();
  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <div className={boxClass}>
        {tags.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag} keyword={tag} onRemove={() => onRemove(tag)} />
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            type="text"
            className="block w-full border-none bg-transparent p-0 text-body text-ink outline-none placeholder:text-ink-muted"
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button size="sm" icon={<AddIcon size={9} />} onClick={onAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    update({ [id]: value } as Partial<FormData>);
  };

  const addTag = (field: "prereqs" | "relevantLinks" | "keywords", value: string, clear: () => void) => {
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
      <div>
        <label htmlFor="projectTitle" className={labelClass}>
          <Required />
          Project title
        </label>
        <input
          type="text"
          id="projectTitle"
          className={fieldClass}
          placeholder="Enter project title"
          value={formData.projectTitle}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          <Required />
          Contact
        </label>
        <div className="space-y-2">
          {Object.entries(formData.contact).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-2 rounded-[8px] bg-surface-muted py-1 pl-3 pr-1">
              <span className="min-w-0 truncate text-small text-ink">
                <span className="font-medium">{key}</span> <span className="font-mono text-meta text-ink-muted">{value}</span>
              </span>
              <IconButton aria-label={`Remove ${key}`} onClick={() => removeContact(key)}>
                <CloseOutlinedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <input
              id="contact-name"
              type="text"
              aria-label="Contact name"
              className={cx(fieldClass, "h-[36px] flex-1")}
              placeholder="Full name"
              value={contactKey}
              onChange={(e) => setContactKey(e.target.value)}
            />
            <div className="flex flex-1 flex-col">
              <input
                type="text"
                aria-label="Contact email"
                aria-invalid={Boolean(contactEmailError)}
                className={cx(fieldClass, "h-[36px]", contactEmailError && "border-danger focus:border-danger")}
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
              {contactEmailError ? <span className="mt-1 text-meta text-danger">{contactEmailError}</span> : null}
            </div>
            <Button size="sm" className="h-[36px]" icon={<AddIcon size={9} />} onClick={addContact}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="colleges-select" className={labelClass}>
          <Required />
          Colleges
        </label>
        <div className="space-y-2">
          {formData.colleges.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {formData.colleges.map((c) => (
                <Tag key={c} keyword={c} onRemove={() => toggleArrayField("colleges", c)} />
              ))}
            </div>
          ) : null}
          <select
            id="colleges-select"
            className={fieldClass}
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

      <div>
        <label htmlFor="department-select" className={labelClass}>
          <Required />
          Department
        </label>
        <div className="space-y-2">
          {formData.department.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {formData.department.map((d) => (
                <Tag key={d} keyword={d} onRemove={() => toggleArrayField("department", d)} />
              ))}
            </div>
          ) : null}
          <select
            id="department-select"
            className={fieldClass}
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

      <div>
        <label htmlFor="description" className={labelClass}>
          <Required />
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          className={cx(fieldClass, "resize-y")}
          placeholder="Describe the research opportunity"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="desiredSkillLevel" className={labelClass}>
          Desired skill level
        </label>
        <input
          type="text"
          id="desiredSkillLevel"
          className={fieldClass}
          placeholder="e.g. Undergraduate Students, Masters Students"
          value={formData.desiredSkillLevel}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="paidUnpaid" className={labelClass}>
          <Required />
          Paid/Unpaid
        </label>
        <select id="paidUnpaid" className={fieldClass} value={formData.paidUnpaid} onChange={handleChange}>
          <option value="">Select compensation type</option>
          {paidOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="position" className={labelClass}>
          <Required />
          Position
        </label>
        <input
          type="text"
          id="position"
          className={fieldClass}
          placeholder="e.g. Independent Study"
          value={formData.position}
          onChange={handleChange}
        />
      </div>

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

      <TagsField
        label="Relevant links"
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

      <div>
        <label htmlFor="timeCommitment" className={labelClass}>
          Time commitment (hrs/week)
        </label>
        <input
          type="number"
          id="timeCommitment"
          className={fieldClass}
          placeholder="e.g. 5"
          min="0"
          step="1"
          value={formData.timeCommitment}
          onChange={(e) => update({ timeCommitment: Math.trunc(Math.max(0, Number(e.target.value))).toString() })}
        />
      </div>

      <div>
        <label htmlFor="anticipatedEndDate" className={labelClass}>
          <Required />
          Anticipated end date
        </label>
        <input
          type="text"
          id="anticipatedEndDate"
          className={fieldClass}
          placeholder="e.g. May 2026"
          value={formData.anticipatedEndDate}
          onChange={handleChange}
        />
      </div>

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
