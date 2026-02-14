import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ResearchType } from "~/DataTypes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import { BsEyeglasses } from "react-icons/bs";
import { FaBook, FaHouse } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { TbCoin } from "react-icons/tb";
import Tag from "./Tag";
import { v4 as uuidv4 } from "uuid";

interface CardPropt {
  research: ResearchType;
}

/* _id 6922390cf86661d05041f3e0
Project Title "Subversive AI"
Contact "{'Sauvik Das': 'sauvik'}"
Description "The subversive AI project is fundamentally about employing human-cente…"
Prereqs "Web/mobile application development and/or machine learning engineering…"
Time Commitment ""
Anticipated End Date "May 2024"
Relevant Links "subversive.ai"
College "['School of Computer Science']"
Department "['Human-Computer Interaction Institute']"
Position "Independent Study"
Paid/Unpaid "Paid"
Desired Skill Level "Undergraduate Students, Masters Students, PhD Students"
*/

const Card = ({ research }: CardPropt) => {

  // Currently for testing purposes:
  const [opportunities, setOpportunities] = useState([]);

  // EXAMPLE OF HOW TO COMMUNICATE W/ MONGO FROM FRONTEND: Fetches the research opportunities from the database.
  useEffect(() => {
    async function getOpportunities() {
      const response = await fetch(`/api/opportunities`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const opportunities = await response.json();
      //console.log(opportunities);
      setOpportunities(opportunities);
    }
    getOpportunities();
    return;
  }, []);
  // ----- //


  const [bookmark, setBookmark] = useState(false);

  function bookmarkOpportunity() {
    setBookmark(!bookmark);
  }

  let professorName = Object.keys(research.contact ?? {}).join(', ');
  let department = Array.isArray(research.department) ? research.department.join(', ') : String(research.department ?? '');

  return (
    // Entire card wrapped in a navlink to the opportunity's page
    <NavLink to={`/info/${research._id}`} className="no-underline text-black">
      <div className="w-full h-72 bg-light-color rounded-xl p-10 relative flex items-start border border-card-highlight overflow-hidden cursor-pointer 
                      transition-all duration-300 ease-in-out hover:shadow-[0_4px_20px_#E2CFFF]">
        {/* First column */}
        <div className="w-[73%] mr-[2%] inline-block overflow-hidden">

          {/* Opportunity name */}
          <h3 className="font-bold text-3xl mb-3 overflow-hidden text-ellipsis whitespace-nowrap">{research.projectTitle}</h3>

          <div className="mb-3 ">
            {/* Professor + Department + Position*/}
            <div className="flex flex-row items-center gap-2">
              <BsEyeglasses/>
              <h3 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{professorName} | </h3>
              <FaHouse/>
              <h3 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{department} | </h3>
              <FaBook/>
              <h3 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{research.position}</h3>
            </div>

            {/* Date */}
            <div className="flex flex-row items-center gap-2">
              <CiCalendar/>
              <h3 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{research.anticipatedEndDate}</h3>
            </div>

            {/* Paid */}
            {research.paidUnpaid !== "" && (
              <div className="flex flex-row items-center gap-2">
                <TbCoin/>
                <h3 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{research.paidUnpaid}</h3>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="overflow-hidden">
            <p className="text-lg flex-grow overflow-hidden text-ellipsis line-clamp-3">
              {research.description?.substring(0, 300)}
              {research.description?.length > 200 && "..."}
            </p>
          </div>

        </div>

        {/* Second column */}
        <div className="w-[25%] flex flex-col">
          {/* Bookmark */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                bookmarkOpportunity();
              }}
            >
              {bookmark ? <BookmarkIcon fontSize="large" /> : <BookmarkIconUnfilled fontSize="large" />}
            </button>
          </div>

          {/* Tags... */}
          
        </div>
      </div>
    </NavLink>
  );
};

export default Card;