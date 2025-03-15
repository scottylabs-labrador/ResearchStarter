import React from "react";
import { useState } from "react";
import star from "../assets/images/star.png";
import star_filled from "../assets/images/star2.png";
import { NavLink } from "react-router-dom";
import { ResearchType } from "~/DataTypes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import Tag from "./Tag";

interface CardPropt {
  research: ResearchType;
}

const Card = ({ research }: CardPropt) => {
  const [varStar, setVarStar] = useState(false);

  function favoriteOpportunity() {
    setVarStar(!varStar);
  }

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
        <button className="px-3 py-2 bg-tag-dark-color text-white rounded my-2">
          <NavLink to={`/info/${research.id}`}>Learn More</NavLink>
        </button>
      </div>
      <div className="w-[25%] inline-block">
        <div className="h-48 w-full overflow-hidden flex gap-y-2  gap-x-2 flex-wrap content-start items-start">
          {research.colleges ? (
            research.colleges.map((word) => (
              <div>
                <Tag keyword={word} />
              </div>
            ))
          ) : (
            <div className="collapse"></div>
          )}
          {research.department ? (
            research.department.map((word) => <Tag keyword={word} />)
          ) : (
            <div className="collapse"></div>
          )}
          {research.keywords ? (
            research.keywords.map((word) => <Tag keyword={word} />)
          ) : (
            <div className="collapse"></div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              favoriteOpportunity();
            }}
          >
            {varStar ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
