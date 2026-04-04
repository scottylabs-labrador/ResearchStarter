import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ResearchType } from "~/DataTypes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { BsEyeglasses } from "react-icons/bs";
import { FaHouse, FaBook } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { TbCoin } from "react-icons/tb";
import Tag from "./Tag";
import { v4 as uuidv4 } from "uuid";

interface CardPropt {
  research: ResearchType;
  showApplyButton?: boolean;
  onApply?: (researchId: string) => void;
}

const Card = ({ research, showApplyButton, onApply }: CardPropt) => {
  const [bookmark, setBookmark] = useState(false);

  function bookmarkOpportunity() {
    setBookmark(!bookmark);
  }

  const professorName = Object.keys(research.contact ?? {}).join(", ");
  const college = Array.isArray(research.college)
    ? research.college.join(", ")
    : "";

  const allKeywords = [
    ...(Array.isArray(research.keywords) ? research.keywords : []),
    ...(Array.isArray(research.department) ? research.department : []),
  ];

  return (
    <NavLink to={`/info/${research._id}`} className="no-underline text-black">
      <div className="w-full bg-white rounded-xl p-6 border border-violet-300 hover:shadow-[0_4px_20px_#E2CFFF] transition-all duration-300">
        {/* Header row: title + posted date + bookmark */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-xl hover:text-purple-700">{research.projectTitle}</h3>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {research.timeAdded && (
              <span className="text-sm text-gray-500">Posted: {research.timeAdded}</span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                bookmarkOpportunity();
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              {bookmark ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
            </button>
          </div>
        </div>

        {/* Info line: professor | college | position */}
        <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-600 mb-1">
          {(() => {
            const items: React.ReactNode[] = [];
            if (professorName) {
              items.push(
                <span key="prof" className="flex items-center gap-1">
                  <BsEyeglasses className="text-base" />
                  {professorName}
                </span>
              );
            }
            if (college) {
              items.push(
                <span key="col" className="flex items-center gap-1">
                  <FaHouse className="text-base" />
                  {college}
                </span>
              );
            }
            if (research.position) {
              items.push(
                <span key="pos" className="flex items-center gap-1">
                  <FaBook className="text-base" />
                  {research.position}
                </span>
              );
            }
            return items.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="mx-1">|</span>}
                {item}
              </React.Fragment>
            ));
          })()}
        </div>

        {/* Date */}
        {research.anticipatedEndDate && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <CiCalendar className="text-base" />
            <span>{research.anticipatedEndDate}</span>
          </div>
        )}

        {/* Compensation */}
        {research.paidUnpaid && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <TbCoin className="text-base" />
            <span>{research.paidUnpaid}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {research.description}
        </p>

        {/* Tags + Apply button */}
        <div className="flex items-end justify-between">
          <div className="flex gap-2 flex-wrap">
            {allKeywords.slice(0, 3).map((keyword) => (
              <Tag key={uuidv4()} keyword={keyword} />
            ))}
          </div>
          {showApplyButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onApply?.(research._id);
              }}
              className="flex items-center gap-1 px-4 py-1.5 border border-violet-400 text-violet-700 rounded-full text-sm hover:bg-violet-50 transition-colors flex-shrink-0"
            >
              &rarr; Apply
            </button>
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default Card;
