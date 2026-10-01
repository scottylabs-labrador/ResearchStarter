import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { BsEyeglasses } from "react-icons/bs";
import { FaHouse, FaBook } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { TbCoin } from "react-icons/tb";
import { ResearchType } from "../DataTypes";
import { matchesCompensation } from "../utils";
import { useSession } from "../lib/authClient";
import Tag from "./Tag";
import Surface from "./ui/Surface";
import IconButton from "./ui/IconButton";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { Meta, MetaRow } from "./ui/Meta";

interface CardProps {
  research: ResearchType;
  showApplyButton?: boolean;
  onApply?: (researchId: string) => void;
}

const iconClass = "shrink-0 text-ink-muted";

const Card = ({ research, showApplyButton, onApply }: CardProps) => {
  const { data: session } = useSession();
  const id = session?.user?.id ?? undefined;

  const [bookmark, setBookmark] = useState(false);

  async function saveUserBookmark(bookmark: boolean, id: string) {
    const response = await fetch(`/api/users/saved/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opportunityId: research._id,
        action: bookmark ? "add" : "remove",
      }),
    });
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }
    console.log(response);
  }

  // Fetch bookmark status
  useEffect(() => {
    async function fetchBookmark() {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const userData = await response.json();
      setBookmark(userData.saved.includes(research._id));
    }

    fetchBookmark();
    return;
  }, []);

  function bookmarkOpportunity() {
    if (id != undefined) {
      setBookmark(!bookmark);
      saveUserBookmark(!bookmark, id);
    } else {
      console.log("Unable to set bookmark due to no user id!");
    }
  }

  const professorName = Object.keys(research.contact ?? {}).join(", ");
  const college = Array.isArray(research.college) ? research.college.join(", ") : "";
  const allKeywords = [
    ...(Array.isArray(research.keywords) ? research.keywords : []),
    ...(Array.isArray(research.department) ? research.department : []),
  ];

  return (
    <Surface as="article" interactive className="relative p-[20px]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="min-w-0 break-words text-card-title text-ink">
          <Link
            to={`/info/${research._id}`}
            className="after:absolute after:inset-0 after:rounded-surface focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ink"
          >
            {research.projectTitle}
          </Link>
        </h3>
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          {research.timeAdded ? <Meta>Posted {research.timeAdded}</Meta> : null}
          <IconButton
            size="sm"
            aria-label={bookmark ? "Remove bookmark" : "Bookmark"}
            pressed={bookmark}
            onClick={bookmarkOpportunity}
          >
            {bookmark ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkIconUnfilled sx={{ fontSize: 20 }} />}
          </IconButton>
        </div>
      </div>

      {professorName || college || research.position ? (
        <MetaRow className="mb-2 text-small text-ink-secondary">
          {professorName ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <BsEyeglasses size={16} className={iconClass} />
              {professorName}
            </span>
          ) : null}
          {college ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <FaHouse size={13} className={iconClass} />
              {college}
            </span>
          ) : null}
          {research.position ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <FaBook size={13} className={iconClass} />
              {research.position}
            </span>
          ) : null}
        </MetaRow>
      ) : null}

      {research.anticipatedEndDate || research.paidUnpaid ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {research.anticipatedEndDate ? <Meta icon={<CiCalendar size={15} />}>{research.anticipatedEndDate}</Meta> : null}
          {research.paidUnpaid ? (
            <Badge tone={matchesCompensation(research.paidUnpaid, "Paid") ? "positive" : "neutral"} icon={<TbCoin size={13} />}>
              {research.paidUnpaid}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {research.description ? (
        <p className="mb-4 line-clamp-3 text-body text-ink-secondary">{research.description}</p>
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
              iconRight={<span aria-hidden="true">→</span>}
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

export default Card;
