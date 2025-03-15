import { Engineering } from "@mui/icons-material";
import React from "react";

interface TagProps {
  keyword: string;
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

const Tag = ({ keyword }: TagProps) => {
  return (
    <div>
      <button className="px-4 py-2 bg-tag-dark-color rounded-md text-white">
        {keyword in collegeAbr ? collegeAbr[keyword] : keyword}
      </button>
    </div>
  );
};

export default Tag;
