import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkIconUnfilled from '@mui/icons-material/BookmarkBorderOutlined';
import Tag from '../Tag'; // Assuming Tag component is in '../Tag'
import { v4 as uuidv4 } from 'uuid'; // For unique keys for tags
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import { BsEyeglasses } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa6';

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
  return (
    <div className="w-[36rem] h-[18rem] bg-light-color rounded-lg shadow-md overflow-hidden flex-shrink-0 flex flex-col p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-jersey text-4xl font-bold text-gray-900 leading-tight flex-grow pr-2">{opportunityName}</h3>
        <button
          onClick={onBookmarkToggle}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label={isBookmarked ? 'Unbookmark' : 'Bookmark'}
        >
          {isBookmarked ? (
            <BookmarkIcon className="text-blue-600 text-2xl" />
          ) : (
            <BookmarkIconUnfilled className="text-gray-400 text-2xl" />
          )}
        </button>
      </div>
      <p className="text-gray-600 text-base mt-1 flex items-center gap-1">
        <BsEyeglasses />
        <span className="font-semibold">{professorName}</span> | <FaBook /> {department}
      </p>
      <p className="text-gray-600 text-base mt-1 flex items-center gap-1">
        <CalendarTodayIcon />
        {date}
      </p>
      <p className="text-gray-600 text-base flex items-center gap-1">
        <SchoolIcon />
        {semester}
      </p>
      <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
        {tags.slice(0, 4).map((tag) => (
          <Tag key={uuidv4()} keyword={tag} />
        ))}
      </div>
    </div>
  );
};

export default OpportunityCard;


