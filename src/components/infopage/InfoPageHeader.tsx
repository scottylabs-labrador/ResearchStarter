import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkIconUnfilled from '@mui/icons-material/BookmarkBorderOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Tag from '../Tag'; // Assuming Tag component is in '../Tag'
import { v4 as uuidv4 } from 'uuid'; // For unique keys for tags

// Define the props that this component will accept
interface InfoPageHeaderProps {
  title: string;
  professorOrLabName: string;
  department: string[];
  college: string[];
  tags: string[]; // This will combine keywords, colleges, and departments for display
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onApplyClick: () => void;
}

const InfoPageHeader: React.FC<InfoPageHeaderProps> = ({
  title,
  professorOrLabName,
  department,
  college,
  tags,
  isBookmarked,
  onBookmarkToggle,
  onApplyClick,
}) => {
  return (
    <div className="bg-white px-6 py-0 rounded-lg mb-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          {/* Title */}
          <h1 className="font-jersey text-7xl font-bold text-gray-900 mb-2">{title}</h1>

          {/* Subtitle: Professor/Lab Name and Department, College */}
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold">{professorOrLabName}</span>
            {department.length > 0 && ` | ${department.join(', ')}`}
            {college.length > 0 && department.length > 0 && ', '}
            {college.length > 0 && college.join(', ')}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={uuidv4()} keyword={tag} />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Bookmark Button */}
          <button
            onClick={onBookmarkToggle}
            className="bg-white border-2 border-dark-color hover:bg-gray-50 py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            {isBookmarked ? (
              <BookmarkIcon className="text-dark-color" />
            ) : (
              <BookmarkIconUnfilled className="text-dark-color" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

          {/* Apply Button */}
          <button
            onClick={onApplyClick}
            className="bg-dark-color hover:card-highlight font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <ArrowForwardIcon />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPageHeader;