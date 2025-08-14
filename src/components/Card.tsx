import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ResearchType } from "~/DataTypes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import Tag from "./Tag";
import { v4 as uuidv4 } from "uuid";

interface CardPropt {
  research: ResearchType;
}

const Card = ({ research }: CardPropt) => {
  const [bookmark, setBookmark] = useState(false);

  function bookmarkOpportunity() {
    setBookmark(!bookmark);
  }

  // Currently for testing purposes:
  const [opportunities, setOpportunities] = useState([]);

  // Fetches the research opportunities from the database.
  useEffect(() => {
    async function getOpportunities() {
      const response = await fetch(`http://localhost:5050/opportunities/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const opportunities = await response.json();
      console.log(opportunities);
      setOpportunities(opportunities);
    }
    getOpportunities();
    return;
  }, [opportunities.length]);
  // ----- //

  return (
    <div className="fadeIn fadeOut w-full h-72 bg-light-color rounded-xl p-10 relative flex items-start">
      <div className="w-[73%] mr-[2%] inline-block">
        <h3 className="font-bold text-3xl mb-3">{research.name}</h3>{" "}
        {research.website != "" ? (
          <div>
            <h3 className="text-lg">Website: {research.website}</h3>
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <p className="text-lg">Description:</p>
          <p className=" break-words">
            {research.description.substring(
              0,
              Math.max(research.description.length, 200)
            )}
          </p>
        </div>
        <button className="px-3 py-2 bg-learn-more-color shadow-black shadow-sm text-black rounded my-2">
          <NavLink to={`/info/${research.id}`}>Learn More</NavLink>
        </button>
      </div>

      <div className="w-[25%] inline-block flex flex-row">
        <div className="h-48 w-full overflow-hidden flex gap-y-2  gap-x-2 flex-wrap content-start items-start">
          {research.colleges ? (
            research.colleges.map((word) => (
              <div>
                <Tag key={uuidv4().concat("col")} keyword={word} />
              </div>
            ))
          ) : (
            <div className="collapse"></div>
          )}
          {research.department ? (
            research.department.map((word) => (
              <Tag key={uuidv4().concat("dep")} keyword={word} />
            ))
          ) : (
            <div className="collapse"></div>
          )}
          {research.keywords ? (
            research.keywords.map((word) => (
              <Tag key={uuidv4().concat("key")} keyword={word} />
            ))
          ) : (
            <div className="collapse"></div>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              bookmarkOpportunity();
            }}
          >
            {bookmark ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
