import React from "react";
import { useState } from "react";
import star from "../assets/images/star.png";
import star_filled from "../assets/images/star2.png";



const Card = ({ research, params }) => {
  const [varStar, setVarStar] = useState(star);

  function favoriteOpportunity() {
    if (varStar == "/src/assets/images/star.png")
      setVarStar(star_filled);
    else
      setVarStar(star);
  }

  return (
    <div className="fadeIn fadeOut w-full h-64 bg-white shadow-2xl rounded-xl p-10">
      <div className="flex flex-col">
        <div className="flex justify-between"> <h3 className="font-bold text-xl">{research.name}</h3> <button onClick={() => { favoriteOpportunity() }}><img className="relative w-9 h-9" src={varStar} /></button></div>
        <div>
          <h3>Topics: {research.topics?.join(" / ")}</h3>
        </div>
        <div>
          <h3>College: {research.colleges?.join(" / ")}</h3>
        </div>
        <div>
          <h3>Departments: {research.department?.join(" / ")}</h3>
        </div>
        <h3>Website: {research.website}</h3>
        <p>Projects: {research.researches?.join(" / ")}</p>
      </div>
    </div>
  );
};

export default Card;
