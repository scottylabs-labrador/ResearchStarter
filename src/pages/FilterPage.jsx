import React from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

const FilterPage = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:8000/research");
        const data = await res.json();
        setResearches(data);
      } catch {
        console.log("Error Fetching Data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  return (
    <>
      <div className="fixed bottom-0 left-0 shadow-2xl w-1/6 h-[93vh]">
        <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
          <h2 className="">Filter</h2>
          <FilterSection criteria="School" />
        </div>
      </div>
      <div className="fixed top-[7vh] right-0 w-5/6 h-[5vh] z-10 bg-white"></div>
      <div className="fixed top-[12vh] h-[88vh] right-0 w-5/6 bg-gray-300 -z-10" />
      <div className="absolute top-[12vh]  right-0 w-5/6  p-10">
        <div className="flex flex-wrap w-full h-full justify-around gap-y-10 gap-x-3">
          {loading ? (
            <>
              <h2>Loading...</h2>
              <Spinner loading={loading} />
            </>
          ) : (
            <>
              {researches.map((research) => (
                <Card key={research.id} research={research}></Card>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterPage;
