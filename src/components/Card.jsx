import React from "react";

const Card = ({ research }) => {
  return (
    <div className="w-[47%] h-[38vh] bg-white shadow-2xl mr-auto rounded-lg p-10">
      <div className="flex flex-col">
        <h3>Name: {research.firstName + " " + research.lastName}</h3>
        <div>
          <h3>Topics: </h3>
        </div>
        <div>
          <h3>Departments: </h3>
        </div>
        <h3>Website: </h3>
        <p>Projects</p>
      </div>
    </div>
  );
};

export default Card;
