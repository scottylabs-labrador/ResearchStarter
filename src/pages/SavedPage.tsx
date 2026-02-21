import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import SavedCard from "../components/CardSaved";
import Spinner from "../components/Spinner";
import { ResearchType } from "../DataTypes";

const SavedPage = () => {
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>("");

  const handleChange = (value: string) => {
    setInput(value);
  };

  let filteredData = researches;

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:8000/research");
        const data = await res.json();
        setResearches(data);
      } catch {
        console.log("Error Fetching Data");
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  return (
    <div className="px-20 py-8">
      <h1 className="text-3xl font-bold pb-10">Saved Research</h1>
      <SearchBar input={input} handleChange={handleChange} />
      <div className="w-full h-full grid grid-cols-2 items-stretch gap-10 mt-10">
        {loading ? (
          <>
            <h2>Loading...</h2>
            <Spinner />
          </>
        ) : (
          <>
            {filteredData.map((research) => (
              <SavedCard key={research._id} research={research}></SavedCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
