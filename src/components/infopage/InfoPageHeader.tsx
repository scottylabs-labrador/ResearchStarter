import React from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tag from "../Tag";
import Button from "../ui/Button";
import { MetaRow } from "../ui/Meta";
import { cx } from "../ui/cx";
import { linkUnderline } from "../ui/linkClass";

interface InfoPageHeaderProps {
  title: string;
  contacts: [name: string, andrewId: string][];
  department: string[];
  college: string[];
  /** Topic keywords. Department and college already appear in the byline. */
  tags: string[];
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onApplyClick: () => void;
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
}) => {
  const hasSubtitle = contacts.length > 0 || department.length > 0 || college.length > 0;

  return (
    <header className="mb-10 mt-6">
      <h1 className="-ms-0.5 mb-3 text-title text-ink sm:text-display">{title}</h1>

      {hasSubtitle ? (
        <MetaRow className="mb-5 text-lead text-ink-secondary">
          {contacts.length > 0 ? (
            <span>
              {contacts.map(([name, andrewId], i) => (
                <React.Fragment key={andrewId}>
                  {i > 0 ? ", " : null}
                  <Link
                    to={profilePath(andrewId)}
                    className={cx(linkUnderline, "rounded font-medium text-ink decoration-hairline-strong transition-colors duration-150 hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink")}
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
