import React from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import IconButton from "../ui/IconButton";
import { Meta, MetaRow } from "../ui/Meta";

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

const iconClass = "shrink-0 text-ink-muted";

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
  const dateLine = [semester, date].filter(Boolean).join(" · ");

  return (
    <Surface as="article" interactive className="flex flex-col p-[20px]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-card-title text-ink">{opportunityName}</h3>
        <IconButton
          size="sm"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          pressed={isBookmarked}
          onClick={onBookmarkToggle}
        >
          {isBookmarked ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkIconUnfilled sx={{ fontSize: 20 }} />}
        </IconButton>
      </div>

      {professorName || department ? (
        <MetaRow className="mb-2 text-small text-ink-secondary">
          {professorName ? (
            <span className="inline-flex items-center gap-1.5">
              <PersonOutlineOutlinedIcon sx={{ fontSize: 15 }} className={iconClass} />
              {professorName}
            </span>
          ) : null}
          {department ? (
            <span className="inline-flex items-center gap-1.5">
              <MenuBookOutlinedIcon sx={{ fontSize: 15 }} className={iconClass} />
              {department}
            </span>
          ) : null}
        </MetaRow>
      ) : null}

      {dateLine ? (
        <Meta icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />} className="mb-4">
          {dateLine}
        </Meta>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {tags.slice(0, 3).map((tag, i) => (
            <Tag key={`${tag}-${i}`} keyword={tag} />
          ))}
        </div>
      ) : null}
    </Surface>
  );
};

export default OpportunityCard;
