import React from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { ResearchType } from "../DataTypes";
import { matchesCompensation } from "../utils";
import { useBookmark } from "../lib/useBookmark";
import Tag from "./Tag";
import Surface from "./ui/Surface";
import IconButton from "./ui/IconButton";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { Meta, MetaRow } from "./ui/Meta";
import { cx } from "./ui/cx";
import { AccountBalanceIcon, ArrowForwardIcon, CalendarIcon, MenuBookIcon, PaidIcon, PersonIcon } from "./ui/icons";

interface CardProps {
  research: ResearchType;
  showApplyButton?: boolean;
  onApply?: (researchId: string) => void;
  /** Off for the listing's own professor, who manages it rather than saves it. */
  showBookmark?: boolean;
  /** Controls placed where the bookmark sits, above the card's link. */
  actions?: React.ReactNode;
}

// Lifted 1px onto the capitals of the 13px text beside them.
const iconClass = "shrink-0 -translate-y-px text-ink-muted";

const Card = ({ research, showApplyButton, onApply, showBookmark = true, actions }: CardProps) => {
  const bookmark = useBookmark(research._id, showBookmark);

  const professorName = Object.keys(research.contact ?? {}).join(", ");
  const college = Array.isArray(research.college) ? research.college.join(", ") : "";
  const allKeywords = [
    ...(Array.isArray(research.keywords) ? research.keywords : []),
    ...(Array.isArray(research.department) ? research.department : []),
  ];
  const posted = research.timeAdded ? `Posted ${research.timeAdded}` : "";
  const hasDateRow = Boolean(research.anticipatedEndDate || research.paidUnpaid);

  return (
    // pt-4, not 5: the title's line-height already adds space above it.
    <Surface as="article" interactive className="relative px-5 pb-5 pt-4">
      <div className="mb-1 flex items-start justify-between gap-4">
        <h3 className="min-w-0 break-words text-card-title text-ink">
          <Link
            to={`/info/${research._id}`}
            className="after:absolute after:inset-0 after:rounded-surface focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
          >
            {research.projectTitle}
          </Link>
        </h3>
        {/* One title line tall, so the date and icon centre on the title's first line. */}
        <div className="relative z-10 flex h-[22px] shrink-0 items-center gap-1">
          {posted ? <Meta className="hidden sm:inline-flex">{posted}</Meta> : null}
          {showBookmark ? (
            <IconButton
              className="-my-1.5 -me-2.5"
              aria-label={bookmark.saved ? "Remove bookmark" : "Bookmark"}
              pressed={bookmark.saved}
              onClick={bookmark.toggle}
            >
              {bookmark.saved ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkIconUnfilled sx={{ fontSize: 20 }} />}
            </IconButton>
          ) : null}
          {actions}
        </div>
      </div>

      {professorName || college || research.position ? (
        <MetaRow className="mb-1.5 text-small text-ink-secondary">
          {professorName ? (
            <span className="inline-flex min-w-0 items-center gap-[5px]">
              <PersonIcon size={12} className={iconClass} />
              {professorName}
            </span>
          ) : null}
          {college ? (
            <span className="inline-flex min-w-0 items-center gap-[5px]">
              <AccountBalanceIcon size={12} className={iconClass} />
              {college}
            </span>
          ) : null}
          {research.position ? (
            <span className="inline-flex min-w-0 items-center gap-[5px]">
              <MenuBookIcon size={10.5} className={iconClass} />
              {research.position}
            </span>
          ) : null}
        </MetaRow>
      ) : null}

      {hasDateRow || posted ? (
        // Phones have no room beside the title, so there the posted date joins this row.
        <div className={cx("mb-3 flex flex-wrap items-center gap-2", !hasDateRow && "sm:hidden")}>
          {research.anticipatedEndDate ? (
            <Meta icon={<CalendarIcon size={11.5} />}>{research.anticipatedEndDate}</Meta>
          ) : null}
          {research.paidUnpaid ? (
            matchesCompensation(research.paidUnpaid, "Paid") ? (
              <Badge tone="positive" className="font-mono" icon={<PaidIcon size={11} />}>
                {research.paidUnpaid}
              </Badge>
            ) : (
              <Meta icon={<PaidIcon size={11} />}>{research.paidUnpaid}</Meta>
            )
          ) : null}
          {posted ? <Meta className="sm:hidden">{posted}</Meta> : null}
        </div>
      ) : null}

      {research.description ? (
        <p className="mb-3 line-clamp-3 max-w-measure text-body text-ink-secondary">{research.description}</p>
      ) : null}

      {allKeywords.length > 0 || showApplyButton ? (
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {allKeywords.slice(0, 3).map((keyword, i) => (
              <Tag key={`${keyword}-${i}`} keyword={keyword} />
            ))}
          </div>
          {showApplyButton ? (
            <Button
              size="sm"
              className="relative z-10 shrink-0"
              iconRight={<ArrowForwardIcon size={10} />}
              onClick={() => onApply?.(research._id)}
            >
              Apply
            </Button>
          ) : null}
        </div>
      ) : null}
    </Surface>
  );
};

export default React.memo(Card);
