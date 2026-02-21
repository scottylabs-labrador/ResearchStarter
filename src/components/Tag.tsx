import { Engineering } from "@mui/icons-material";
import React from "react";

interface TagProps {
  keyword: string;
  className?: string; // Add className prop
}

const collegeAbr: { [id: string]: string } = {
  "College of Engineering": "Engineering",
  "College of Fine Arts": "CFA",
  "Dietrich College of Humanities & Social Sciences": "Dietrich",
  "Heinz College of Information Systems and Public Policy": "Heinz",
  "Mellon College of Science": "MCS",
  "School of Computer Science": "SCS",
  "Tepper School of Business": "Tepper",
  "Electrical & Computer Engineering": "ECE",
  "Artificial Intelligence": "AI",
};

const Tag = ({ keyword, className }: TagProps) => {
  return (
    <div className="max-w-full">
      <button
        className={`max-w-full px-4 py-2 bg-brand-50 rounded-md inline-flex items-center justify-center text-sm whitespace-normal break-words text-center leading-tight ${className || ""}`}
      >
        {keyword in collegeAbr ? collegeAbr[keyword] : keyword}
      </button>
    </div>
  );
};

export default Tag;
