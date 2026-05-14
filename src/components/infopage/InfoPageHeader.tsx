import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkIconUnfilled from '@mui/icons-material/BookmarkBorderOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Tag from '../Tag';
import { v4 as uuidv4 } from 'uuid';

interface InfoPageHeaderProps {
  title: string;
  professorOrLabName: string;
  department: string[];
  college: string[];
  tags: string[]; // Combines keywords, colleges, and departments for display
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onApplyClick: () => void;
  position?: string;
  compensation?: string;
  timeCommitment?: string;
}

interface SubtitlePart {
  text: string;
  emphasis?: boolean;
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
  position,
  compensation,
  timeCommitment,
}) => {
  const eyebrowParts = [
    position,
    compensation,
    timeCommitment ? `${timeCommitment} hrs/week` : null,
  ].filter(Boolean) as string[];

  const subtitleParts: SubtitlePart[] = [
    professorOrLabName ? { text: professorOrLabName, emphasis: true } : null,
    department.length > 0 ? { text: department.join(', ') } : null,
    college.length > 0 ? { text: college.join(', ') } : null,
  ].filter(Boolean) as SubtitlePart[];

  return (
    <div className="bg-white px-6 lg:px-8 py-4 mb-8">
      <div className="mb-6">
        {/* Eyebrow */}
        {eyebrowParts.length > 0 && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
            {eyebrowParts.map((part, i) => (
              <React.Fragment key={part}>
                {i > 0 && (
                  <span className="text-gray-400 mx-2" aria-hidden="true">
                    &middot;
                  </span>
                )}
                {part}
              </React.Fragment>
            ))}
          </p>
        )}

        {/* Title */}
        <h1 className="font-jersey text-7xl font-bold text-gray-900 mb-3 leading-none">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitleParts.length > 0 && (
          <p className="text-lg mb-4">
            {subtitleParts.map((part, i) => (
              <React.Fragment key={part.text}>
                {i > 0 && (
                  <span className="text-gray-400 mx-2" aria-hidden="true">
                    &middot;
                  </span>
                )}
                <span
                  className={part.emphasis ? 'text-gray-900 font-medium' : 'text-gray-600'}
                >
                  {part.text}
                </span>
              </React.Fragment>
            ))}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={uuidv4()} keyword={tag} />
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onApplyClick}
          className="inline-flex items-center gap-2 h-11 px-6 bg-card-highlight text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(126,85,178,0.35)] active:translate-y-0 active:shadow-none active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-card-highlight focus-visible:ring-offset-2"
        >
          Apply now
          <ArrowForwardIcon fontSize="small" />
        </button>

        <button
          onClick={onBookmarkToggle}
          aria-pressed={isBookmarked}
          className="inline-flex items-center gap-2 h-11 px-5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-colors duration-200 hover:bg-gray-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-card-highlight focus-visible:ring-offset-2"
        >
          {isBookmarked ? (
            <BookmarkIcon fontSize="small" className="text-card-highlight" />
          ) : (
            <BookmarkIconUnfilled fontSize="small" className="text-gray-500" />
          )}
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default InfoPageHeader;
