import React from "react";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

import { useUser } from "@clerk/clerk-react";
import { UserResource, UseUserReturn } from "@clerk/types";
import { ResearchType } from "../DataTypes";

const DashboardPage = () => {
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:8000/research");
        const data = await res.json();
        setResearches(data);
      } catch (error) {
        console.log("Error Fetching Data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  return (
    <>
      <div>
        <h1 className="pt-20 ml-12 leading-loose text-6xl">
          Welcome {user?.firstName} {user?.lastName}
        </h1>
        <p className="h-32 leading-8 bg-gray-300 ml-12 mr-12"></p>
        <h1 className="ml-12 leading-normal text-6xl">
          Featured Opportunities
        </h1>
      </div>

      <div className="top-[12vh]  right-0 w-5/6  ml-14">
        <div className="flex flex-wrap w-full h-full justify-around gap-y-10 gap-x-3">
          {loading ? (
            <>
              <h2>Loading...</h2>
              <Spinner />
            </>
          ) : (
            <>
              {researches.map((research) => (
                <Card research={research}></Card>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
