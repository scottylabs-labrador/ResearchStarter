import React from "react";

const Card = ({ research }) => {
  return (
    <div className="w-full h-64 bg-white shadow-2xl rounded-xl p-10">
      <div className="flex flex-col">
        <h3 className="font-bold text-xl">{research.firstName + " " + research.lastName}</h3>
        <div>
          <h3>Topics: {research.topics.join(" / ")}</h3>
        </div>
        <div>
          <h3>Departments: {research.department.join(" / ")}</h3>
        </div>
        <h3>Website: {research.website}</h3>
        <p>Projects: {research.researches.join(" / ")}</p>
      </div>
    </div>
  );
};

export default Card;
