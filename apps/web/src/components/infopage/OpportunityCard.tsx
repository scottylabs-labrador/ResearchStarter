import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkIconUnfilled from '@mui/icons-material/BookmarkBorderOutlined';
import { BsEyeglasses } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa6';
import { CiCalendar } from 'react-icons/ci';
import Tag from '../Tag';
import { v4 as uuidv4 } from 'uuid';

interface OpportunityCardProps {
  opportunityName: string;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  professorName: string;
  department: string;
  date: string;
  semester: string;
  tags: string[];
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunityName,
  isBookmarked,
  onBookmarkToggle,
  professorName,
  department,
  date,
  semester,
  tags,
}) => {
  const metaItems: React.ReactNode[] = [];
  if (professorName) {
    metaItems.push(
      <span key="prof" className="flex items-center gap-1">
        <BsEyeglasses className="text-base flex-shrink-0" />
        {professorName}
      </span>
    );
  }
  if (department) {
    metaItems.push(
      <span key="dept" className="flex items-center gap-1">
        <FaBook className="text-base flex-shrink-0" />
        {department}
      </span>
    );
  }

  const dateLine = [semester, date].filter(Boolean).join(' · ');

  return (
    <div className="w-[26rem] flex-shrink-0 bg-white rounded-xl p-6 border border-violet-300 hover:shadow-[0_4px_20px_#E2CFFF] transition-all duration-300 flex flex-col">
      {/* Title + bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-lg text-gray-900 leading-snug flex-1">
          {opportunityName}
        </h3>
        <button
          onClick={onBookmarkToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {isBookmarked ? (
            <BookmarkIcon className="text-card-highlight" />
          ) : (
            <BookmarkIconUnfilled />
          )}
        </button>
      </div>

      {/* Professor | Department */}
      {metaItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-600 mb-2">
          {metaItems.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="mx-1 text-gray-400">|</span>}
              {item}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Date */}
      {dateLine && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
          <CiCalendar className="text-base flex-shrink-0" />
          <span>{dateLine}</span>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tags.slice(0, 3).map((tag) => (
            <Tag key={uuidv4()} keyword={tag} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
