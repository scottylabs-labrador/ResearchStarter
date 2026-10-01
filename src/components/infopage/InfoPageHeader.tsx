import React from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tag from "../Tag";
import Button from "../ui/Button";
import { Meta, MetaRow } from "../ui/Meta";

interface InfoPageHeaderProps {
  title: string;
  contacts: [name: string, andrewId: string][];
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

const profilePath = (andrewId: string) => `/professor/${encodeURIComponent(andrewId.split("@")[0] ?? andrewId)}`;

const InfoPageHeader: React.FC<InfoPageHeaderProps> = ({
  title,
  contacts,
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
  const eyebrow = [position, compensation, timeCommitment ? `${timeCommitment} hrs/week` : undefined].filter(
    (part): part is string => Boolean(part)
  );
  const hasSubtitle = contacts.length > 0 || department.length > 0 || college.length > 0;

  return (
    <header className="mb-10 mt-6">
      {eyebrow.length > 0 ? (
        <MetaRow className="mb-3">
          {eyebrow.map((part) => (
            <Meta key={part}>{part}</Meta>
          ))}
        </MetaRow>
      ) : null}

      <h1 className="mb-3 text-display text-ink">{title}</h1>

      {hasSubtitle ? (
        <MetaRow className="mb-5 text-[15px] text-ink-secondary">
          {contacts.length > 0 ? (
            <span>
              {contacts.map(([name, andrewId], i) => (
                <React.Fragment key={andrewId}>
                  {i > 0 ? ", " : null}
                  <Link
                    to={profilePath(andrewId)}
                    className="rounded font-medium text-ink underline decoration-hairline-strong underline-offset-4 transition-colors duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {name}
                  </Link>
                </React.Fragment>
              ))}
            </span>
          ) : null}
          {department.length > 0 ? <span>{department.join(", ")}</span> : null}
          {college.length > 0 ? <span>{college.join(", ")}</span> : null}
        </MetaRow>
      ) : null}

      {tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <Tag key={`${tag}-${i}`} keyword={tag} />
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={onApplyClick} iconRight={<ArrowForwardIcon sx={{ fontSize: 16 }} />}>
          Apply now
        </Button>
        <Button
          onClick={onBookmarkToggle}
          aria-pressed={isBookmarked}
          icon={
            isBookmarked ? (
              <BookmarkIcon sx={{ fontSize: 16 }} />
            ) : (
              <BookmarkIconUnfilled sx={{ fontSize: 16 }} className="text-ink-muted" />
            )
          }
        >
          {isBookmarked ? "Saved" : "Save"}
        </Button>
      </div>
    </header>
  );
};

export default InfoPageHeader;
