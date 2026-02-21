import React from "react";
import Card from "~/components/Card";
import { NavLink } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <div className="w-[100vw] h-[60vh] bg-gradient-to-r from-dark-color from-30% to-light-color to-90% grid grid-cols-10 grid-rows-4">
        <div className="col-start-1 col-end-4 grid-rows-1 flex items-center justify-center">
          <h2 className="font-jersey text-5xl font-semibold italic transition translate-x-5">
            Welcome to...
          </h2>
        </div>
        <div className="col-start-2 col-end-6 row-start-2 row-end-4 flex items-center">
          <h1 className="font-jersey text-9xl leading-[0.8] tracking-wider font-bold animate-slidingIn transform scale-y-125 scale-x-120 origin-left">
            CMU Research
          </h1>
        </div>
        <div className="col-start-2 col-end-5 row-start-4 flex items-center">
          <div>
            <button className="px-5 py-3 text-lg bg-tag-dark-color text-white rounded-xl mr-10">
              <NavLink to="/" className="font-jersey font-bold text-lg">Start Applying</NavLink>
            </button>
            <button className="px-5 py-3 text-lg bg-transparent text-tag-dark-color rounded-xl font-bold border-[2px] border-tag-dark-color rounded">
              <NavLink to="/" className="font-jersey font-bold text-lg">Start Posting</NavLink>
            </button>
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-[50vh] px-14 py-16">
        <h1 className="font-jersey font-bold text-3xl">Selected Research Opportunities:</h1>
        <div></div>
      </div>
    </div>
  );
};

export default MainPage;
