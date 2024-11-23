import React, { memo, useMemo } from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";

const FilterPage = () => {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  let filteredData = researches;
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

  useEffect(()=>{},[input]) ;

  filteredData = useMemo(()=>{return search(input, researches)},
  [input, researches]
  )

  const handleChange = (value) => {
    console.log("hi");
    setInput(value);
    // filteredData = search(value, researches);
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 shadow-2xl w-1/6 h-[93vh]">
        <div className="flex flex-col justify-normal items-start p-6 gap-y-5">
          <h2 className="">Filter</h2>
          <FilterSection criteria="School" />
        </div>
      </div>
      <div className="fixed top-[7vh] right-0 w-5/6 h-[6vh] z-10  bg-gray-300 flex justify-center items-center">
        <SearchBar data={researches} input={input} handleChange={handleChange} />
      </div>
      <div className="fixed top-[13vh] right-0 w-5/6 h-[3vh] z-10  bg-gradient-to-b from-gray-300/100 to-white/5">
      </div>
      <div className="fixed top-[12vh] h-[88vh] right-0 w-5/6 bg-gray-300 -z-10" />
      <div className="absolute top-[12vh]  right-0 w-5/6  px-10 pb-10 pt-7 flex justify-center">
        <div className="w-full h-full grid grid-cols-1 items-stretch gap-5">
          {loading ? (
            <>
              <h2>Loading...</h2>
              <Spinner loading={loading} />
            </>
          ) : (
            <>
              {filteredData.map((research) => (
                <Card key={research.id} research={research}></Card>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// reference https://stackoverflow.com/questions/45615509/search-through-json-with-keywords
function search(keyword, data){
  if(keyword.length<1) // skip if input is empty
      return data;

  var filteredResults = [];

  for(var i in data){ // iterate through dataset
      var search_fields = Object.keys(data[i]);
      console.log(search_fields);
      var highRel = 0;
      for(var u=0;u<search_fields.length;u++){ // iterate through each key in dataset
          highRel = Math.max(getRelevance(data[i][search_fields[u]],keyword), highRel) // check if higher match
      }
      if(highRel==0) // no matches...
        continue // ...skip
      filteredResults.push({relevance:highRel,entry:data[i]}) // matches found, add to results and store relevance
  }

  filteredResults.sort(compareRelevance) // sort by relevance

  for(i=0;i<filteredResults.length;i++){
      filteredResults[i] = filteredResults[i].entry // remove relevance since it is no longer needed
  }

  return filteredResults;
}

function getRelevance(value,keyword){
  if (value == undefined) return 0;
  if (!typeof value === 'string' && !value instanceof String) return 0; // not string

  console.log(value);

  if (Array.isArray(value)) {
    value = value.join("");
  } 
  value = value.toLowerCase() // lowercase to make search not case sensitive
  keyword = keyword.toLowerCase()

  var index = value.indexOf(keyword) // index of the keyword
  var word_index = value.indexOf(' '+keyword) // index of the keyword if it is not on the first index, but a word

  if(index==0) // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
      return 3 // highest relevance
  else if(word_index!=-1) // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
      return 2 // medium relevance
  else if(index!=-1) // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
      return 1 // low relevance
  else
      return 0 // no matches, no relevance
}

function compareRelevance(a, b) {
return b.relevance - a.relevance
}

export default FilterPage;



{/* <div className="fixed top-[7vh] right-0 w-5/6 h-[5vh] z-10  bg-gray-300 flex justify-center items-center">
<div className='w-11/12 h-5/6'>
    <div className='bg-white w-full rounded-xl px-4 py-1 h-full flex items-center shadow-sm'>
      <FaSearch className='inline-block text-pink-800'/>
      <input className='px-4 bg-transparent border-none h-full text-xl focus:outline-none' placeholder="Search Opportunities"
      value={input} onChange={(e) => {handleChange(e.target.value)}}></input>
    </div>
    <div>Search Results</div>
</div>
</div> */}