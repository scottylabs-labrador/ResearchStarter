import React from "react";
import Card from "~/components/Card";
import { NavLink } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <div className="w-[100vw] h-[60vh] bg-[linear-gradient(to_right,#E4D3FF,#C5A2FF)] grid grid-cols-10 grid-rows-4">
        <div className="col-start-1 col-end-4 grid-rows-1 flex items-center justify-center">
          <h2 className="text-[64px] font-normal leading-[100%] tracking-[0%] font-jersey transition translate-x-5">
            Welcome to...
          </h2>
        </div>
        <div className="col-start-2 col-end-6 row-start-2 row-end-4 flex items-center">
          <h1 className="text-[150px] font-normal leading-[100%] tracking-[0%] font-jersey animate-slidingIn">
            CMU Research
          </h1>
        </div>
        <div className="col-start-2 col-end-5 row-start-4 flex items-center">
          <div>
            <button className="w-[216px] h-[59px] px-3 py-2 text-[28px] font-normal leading-[100%] tracking-[0.5px] font-jersey-20 bg-tag-dark-color text-white rounded-[100px] mr-10">
              <NavLink to="/">Start Applying</NavLink>
            </button>
            <button className="w-[216px] h-[59px] px-3 py-2 text-[28px] font-normal leading-[100%] tracking-[0.5px] font-jersey bg-transparent text-tag-dark-color rounded-[100px] border-[4px] border-tag-dark-color">
              Start Posting
            </button>
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-[50vh] px-14 py-16">
        <h1 className="text-[30px] font-normal leading-[110%] tracking-[0%] font-jersey align-middle">Selected Research Opportunities:</h1>
        <div></div>
      </div>
    </div>
  );
};

export default MainPage;
