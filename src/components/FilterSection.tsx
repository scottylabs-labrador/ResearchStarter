import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckIcon from "@mui/icons-material/Check";
import { departmentOptions } from "../FilterData";
import Button from "./ui/Button";
import SectionLabel from "./ui/SectionLabel";
import SegmentedControl from "./ui/SegmentedControl";

interface FilterSectionProps {
  navHidden?: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  collegeChecks: Record<string, boolean>;
  onCollegeCheck: (name: string, checked: boolean) => void;
  onCollegeReset: () => void;
  selectedDepartment: string[];
  onDepartmentChange: (value: string[]) => void;
  selectedEducation: string[];
  onEducationChange: (value: string[]) => void;
  selectedCompensation: string;
  onCompensationChange: (value: string) => void;
  selectedSemester: string[];
  onSemesterChange: (value: string[]) => void;
  onResetAll: () => void;
}

const colleges = [
  "All",
  "College of Engineering",
  "College of Fine Arts",
  "Dietrich College",
  "Heinz College",
  "Mellon College of Science",
  "School of Computer Science",
  "Tepper School of Business",
  "CMU Qatar",
];

const DEPARTMENT_PREVIEW_COUNT = 8;
const educationOptions = ["Undergraduate", "Masters", "PhD"];
const semesterOptions = ["Fall", "Spring", "Summer"];
const compensationOptions = [
  { value: "", label: "Any" },
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const toggleValue = (arr: string[], value: string): string[] =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterCheckbox = ({ label, checked, onChange }: FilterCheckboxProps) => (
  <label className="flex min-h-[32px] cursor-pointer items-start gap-2.5 rounded-[8px] px-2 py-[5px] text-body text-ink-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-ink">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
    <span
      aria-hidden="true"
      className="mt-[3px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border border-hairline-strong bg-surface transition-colors duration-150 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas"
    >
      {checked ? <CheckIcon sx={{ fontSize: 12 }} className="text-white" /> : null}
    </span>
    <span className="min-w-0">{label}</span>
  </label>
);

const ResetButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="rounded px-1 text-meta font-medium text-accent-strong underline-offset-2 transition-colors duration-150 hover:text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    Reset
  </button>
);

interface FilterGroupProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const FilterGroup = ({ label, open, onToggle, action, children }: FilterGroupProps) => (
  <div className="mb-5">
    <SectionLabel collapsed={!open} onToggle={onToggle} action={action} className="mb-1.5 px-2">
      {label}
    </SectionLabel>
    {open ? <div>{children}</div> : null}
  </div>
);

const FilterSection = ({
  navHidden,
  visible,
  onToggleVisible,
  collegeChecks,
  onCollegeCheck,
  onCollegeReset,
  selectedDepartment,
  onDepartmentChange,
  selectedEducation,
  onEducationChange,
  selectedCompensation,
  onCompensationChange,
  selectedSemester,
  onSemesterChange,
  onResetAll,
}: FilterSectionProps) => {
  const [open, setOpen] = useState({
    college: true,
    department: false,
    education: true,
    compensation: true,
    semester: true,
  });
  const toggle = (key: keyof typeof open) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const hiddenDepartmentCount = departmentOptions.length - DEPARTMENT_PREVIEW_COUNT;
  const visibleDepartments = showAllDepartments
    ? departmentOptions
    : departmentOptions.slice(0, DEPARTMENT_PREVIEW_COUNT);

  if (!visible) return null;

  const anyCollege = Object.entries(collegeChecks).some(([name, checked]) => checked && name !== "All");
  const anyActive =
    anyCollege ||
    selectedDepartment.length > 0 ||
    selectedEducation.length > 0 ||
    selectedCompensation !== "" ||
    selectedSemester.length > 0;

  return (
    <aside
      aria-label="Filters"
      className="scrollbar-minimal fixed left-0 top-0 z-10 h-screen w-[280px] overflow-y-auto border-r border-hairline bg-canvas motion-reduce:transition-none"
      style={{ transform: navHidden ? "translateY(0)" : "translateY(var(--nav-h))" }}
    >
      <div className="px-4 pb-[calc(1.25rem+var(--nav-h))] pt-[26px]">
        <div className="mb-5 flex items-center justify-between px-2">
          <h2 className="text-heading text-ink">Filters</h2>
          <Button
            size="sm"
            variant="ghost"
            aria-label="Hide filters"
            className="ps-2.5"
            icon={<KeyboardArrowLeftIcon sx={{ fontSize: 16, mx: "-4px" }} />}
            onClick={onToggleVisible}
          >
            Hide
          </Button>
        </div>

        <FilterGroup
          label="College"
          open={open.college}
          onToggle={() => toggle("college")}
          action={anyCollege ? <ResetButton label="Reset college filters" onClick={onCollegeReset} /> : null}
        >
          {colleges.map((college) => (
            <FilterCheckbox
              key={college}
              label={college}
              checked={collegeChecks[college] ?? false}
              onChange={(checked) => onCollegeCheck(college, checked)}
            />
          ))}
        </FilterGroup>

        <FilterGroup
          label="Department"
          open={open.department}
          onToggle={() => toggle("department")}
          action={
            selectedDepartment.length > 0 ? (
              <span className="flex items-center gap-2">
                <span className="font-mono text-meta text-ink-muted">{selectedDepartment.length} selected</span>
                <ResetButton label="Reset department filters" onClick={() => onDepartmentChange([])} />
              </span>
            ) : null
          }
        >
          {visibleDepartments.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedDepartment.includes(opt.value)}
              onChange={() => onDepartmentChange(toggleValue(selectedDepartment, opt.value))}
            />
          ))}
          {hiddenDepartmentCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAllDepartments((prev) => !prev)}
              aria-expanded={showAllDepartments}
              className="flex h-[32px] w-full items-center rounded-[8px] px-2 text-small font-medium text-ink-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {showAllDepartments ? "Show fewer" : `Show ${hiddenDepartmentCount} more`}
            </button>
          ) : null}
        </FilterGroup>

        <FilterGroup label="Education" open={open.education} onToggle={() => toggle("education")}>
          {educationOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={selectedEducation.includes(opt)}
              onChange={() => onEducationChange(toggleValue(selectedEducation, opt))}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Compensation" open={open.compensation} onToggle={() => toggle("compensation")}>
          <div className="px-2">
            <SegmentedControl
              aria-label="Compensation"
              value={selectedCompensation}
              onChange={onCompensationChange}
              options={compensationOptions}
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Semester" open={open.semester} onToggle={() => toggle("semester")}>
          {semesterOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={selectedSemester.includes(opt)}
              onChange={() => onSemesterChange(toggleValue(selectedSemester, opt))}
            />
          ))}
        </FilterGroup>

        <Button className="mt-2 w-full" onClick={onResetAll} disabled={!anyActive}>
          Reset all filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSection;
