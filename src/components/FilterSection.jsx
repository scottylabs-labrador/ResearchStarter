import React from "react";

const FilterSection = ({ criteria = "Department" }) => {
  return (
    <div className="">
      <h3>{criteria}</h3>
    </div>
  );
};

export default FilterSection;
