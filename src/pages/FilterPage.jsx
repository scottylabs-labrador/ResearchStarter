import React from "react";
import FilterSection from "../components/FilterSection";

const FilterPage = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 shadow-2xl w-1/6 h-[93vh]">
        <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
          <h2 className="">Filter</h2>
          <FilterSection criteria="School" />
        </div>
      </div>
    </>
  );
};

export default FilterPage;
