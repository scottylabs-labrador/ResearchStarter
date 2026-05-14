import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { departmentOptions } from "../FilterData";

interface FilterSectionProps {
  navHidden?: boolean;
  visible: boolean;
  onToggleVisible: () => void;
  collegeChecks: Record<string, boolean>;
  onCollegeCheck: (name: string, checked: boolean) => void;
  onCollegeReset: () => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedEducation: string;
  onEducationChange: (value: string) => void;
  selectedCompensation: string;
  onCompensationChange: (value: string) => void;
  selectedSemester: string;
  onSemesterChange: (value: string) => void;
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

const educationOptions = ["Undergraduate", "Masters", "PhD"];
const compensationOptions = ["Paid", "Unpaid"];
const semesterOptions = ["Fall", "Spring", "Summer"];

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
  const [collegeExpanded, setCollegeExpanded] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-[280px] bg-[#F3EAFF] border-r border-gray-200 overflow-y-auto transition-all duration-300 z-10"
      style={{ top: navHidden ? 0 : "10vh", height: navHidden ? "100vh" : "90vh" }}
    >
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Filter</h2>
          <button
            onClick={onToggleVisible}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-300"
          >
            Hide <span className="text-xs">‹</span>
          </button>
        </div>

        {/* College */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-gray-800">College</h3>
            <button
              onClick={onCollegeReset}
              className="text-xs text-purple-600 hover:text-purple-800 transition-colors duration-200 ease-out"
            >
              Reset
            </button>
          </div>
          <div className="relative mb-2">
            <button
              onClick={() => setCollegeExpanded(!collegeExpanded)}
              className="w-full appearance-none text-left bg-white border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm text-gray-700"
            >
              None
            </button>
            {collegeExpanded ? (
              <KeyboardArrowUpIcon
                fontSize="small"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            ) : (
              <KeyboardArrowDownIcon
                fontSize="small"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            )}
          </div>
          {collegeExpanded && (
            <div className="space-y-1 ml-1">
              {colleges.map((college) => (
                <label key={college} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={collegeChecks[college] ?? false}
                    onChange={(e) => onCollegeCheck(college, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 accent-purple-600"
                  />
                  {college}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Department */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Department</h3>
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm text-gray-700"
            >
              <option value="">None</option>
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              fontSize="small"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Education</h3>
          <div className="relative">
            <select
              value={selectedEducation}
              onChange={(e) => onEducationChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm text-gray-700"
            >
              <option value="">None</option>
              {educationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              fontSize="small"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Compensation Type */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Compensation Type</h3>
          <div className="relative">
            <select
              value={selectedCompensation}
              onChange={(e) => onCompensationChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm text-gray-700"
            >
              <option value="">None</option>
              {compensationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              fontSize="small"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Semester */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Semester</h3>
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => onSemesterChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm text-gray-700"
            >
              <option value="">None</option>
              {semesterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              fontSize="small"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Reset All */}
        <button
          onClick={onResetAll}
          className="w-full text-center text-sm text-purple-600 border border-purple-300 rounded-md py-2 transition-colors duration-200 ease-out hover:bg-purple-50 mb-8"
        >
          Reset
        </button>

        {/* Legend */}
        <div>
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Legend</h3>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
