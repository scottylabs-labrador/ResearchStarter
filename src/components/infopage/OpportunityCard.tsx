import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkIconUnfilled from '@mui/icons-material/BookmarkBorderOutlined';
import Tag from '../Tag'; // Assuming Tag component is in '../Tag'
import { v4 as uuidv4 } from 'uuid'; // For unique keys for tags

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
    <div className="w-[36rem] h-[18rem] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 flex flex-col p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-gray-900 leading-tight flex-grow pr-2">{opportunityName}</h3>
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
      <p className="text-gray-600 text-base mt-1">
        <span className="font-semibold">{professorName}</span> | {department}
      </p>
      <p className="text-gray-600 text-base mt-1">Date: {date}</p>
      <p className="text-gray-600 text-base">Semester: {semester}</p>
      <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
        {tags.slice(0, 4).map((tag) => (
          <Tag key={uuidv4()} keyword={tag} />
        ))}
      </div>
    </div>
  );
};

export default OpportunityCard;


