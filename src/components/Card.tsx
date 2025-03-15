import React from "react";
import { useState } from "react";
import star from "../assets/images/star.png";
import star_filled from "../assets/images/star2.png";
import { NavLink } from "react-router-dom";
import { ResearchType } from "~/DataTypes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";

interface CardPropt {
  research: ResearchType;
}

const Card = ({ research }: CardPropt) => {
  const [varStar, setVarStar] = useState(false);

  function favoriteOpportunity() {
    setVarStar(!varStar);
  }

  return (
    <div className="fadeIn fadeOut w-full h-64 bg-light-color rounded-xl p-10">
      <div className="w-[75%] inline-block">
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
        <button
          onClick={() => {
            favoriteOpportunity();
          }}
        >
          {varStar ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
        </button>
      </div>
    </div>
  );
};

export default Card;
