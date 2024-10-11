import React from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";

const FilterPage = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 shadow-2xl w-1/6 h-[93vh]">
        <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
          <h2 className="">Filter</h2>
          <FilterSection criteria="School" />
        </div>
      </div>
      <div className="fixed top-[7vh] right-0 w-5/6 h-[5vh]"></div>
      <div className="absolute top-[12vh] h-[88vh] right-0 w-5/6 bg-gray-100 p-10">
        <div className="flex flex-wrap w-full h-full justify-around gap-y-10 gap-x-3">
          <Card name={"Hippo"}></Card>
          <Card name={"Theo"}></Card>
          <Card name={"Chonk"}></Card>
          <Card name={"Chonk"}></Card>
          <Card name={"Chonk"}></Card>
          <Card name={"Chonk"}></Card>
        </div>
      </div>
    </>
  );
};

export default FilterPage;
