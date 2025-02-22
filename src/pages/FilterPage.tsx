import React, { memo, useContext, useMemo } from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import { useParams } from "react-router-dom";
import { ResearchKeysType, ResearchType } from "../DataTypes";
import { OptionType } from "~/filterData";
import { MultiValue } from "react-select";

type FilterKeysType = { [key: string]: boolean };

const FilterPage = () => {
  const pg = useParams();
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<string>("");
  const [filterDep, setFilterDep] = useState<FilterKeysType>({
    All: true,
  });
  const [filterCollege, setFilterCollege] = useState<FilterKeysType>({
    All: true,
    "College of Engineering": true,
    "College of Fine Arts": true,
    "Dietrich College of Humanities & Social Sciences": true,
    "Heinz College of Information Systems and Public Policy": true,
    "Mellon College of Science": true,
    "School of Computer Science": true,
    "Tepper School of Business": true,
  });

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

  useEffect(() => {}, [input]);
  useEffect(() => {}, [filterCollege]);
  useEffect(() => {}, [filterDep]);

  filteredData = useMemo(() => {
    return search(input, researches, filterDep, filterCollege);
  }, [input, researches, filterDep, filterCollege]);

  const handleChange = (value: string) => {
    setInput(value);
    // filteredData = search(value, researches);
  };

  const onSelected = (e: MultiValue<OptionType>): false => {
    if (e == null) return false;
    let temp: FilterKeysType = {};
    if (e.length == 0) {
      // nothing is selected, no filter
      temp["All"] = true;
    } else {
      temp["All"] = false;

      for (var i = 0; i < e.length; i++) {
        temp[e[i]!["value"]]! = true;
      }
    }
    setFilterDep(temp); // Save the copy to state
    return false;
  };

  const onChecked = (target: HTMLInputElement): false => {
    let temp = JSON.parse(JSON.stringify(filterCollege));
    temp[target.name] = target.checked; // Set new field
    if (target.name == "All" && target.checked) {
      const allC = document.getElementsByClassName(
        "collegeCheck"
      ) as HTMLCollectionOf<HTMLInputElement>;
      Array.from(allC).forEach((element) => {
        element.checked = true;
        temp[element.name] = true;
      });
    }
    if (!target.checked) {
      const allB = document.getElementById("CollegeAll") as HTMLInputElement;
      allB.checked = false;
      temp["All"] = false;
    }
    setFilterCollege(temp); // Save the copy to state
    return false;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 shadow-2xl w-1/6 h-[93vh]">
        <FilterSection onChecked={onChecked} onSelected={onSelected} />
      </div>
      <div className="fixed top-[7vh] right-0 w-5/6 h-[6vh] z-10  bg-gray-300 flex justify-center items-center">
        <SearchBar
          data={researches}
          input={input}
          handleChange={handleChange}
        />
      </div>
      <div className="fixed top-[13vh] right-0 w-5/6 h-[3vh] z-10  bg-gradient-to-b from-gray-300/100 to-white/5"></div>
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
                <Card key={research.id} research={research} params={pg}></Card>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

type filterTupeType = { relevance: number; entry: ResearchType };

// reference https://stackoverflow.com/questions/45615509/search-through-json-with-keywords
function search(
  keyword: string,
  data: ResearchType[],
  filterDep: FilterKeysType,
  filterCollege: FilterKeysType
) {
  let filteredResults: filterTupeType[] = [];

  for (var i in data) {
    // iterate through dataset
    if (!filterDep["All"]) {
      // dep don't match
      let found = false;
      const fList = data[i]!["department"];
      if (fList == undefined) continue;
      for (var j = 0; j < fList.length; j++) {
        const result = filterDep[fList[j]!] ?? false;
        if (result) {
          found = true;
        }
      }
      continue;
    }

    if (!filterCollege["All"]) {
      // college don't match
      let found = false;
      const cList = data[i]!["colleges"];
      if (cList == undefined) continue;
      for (var j = 0; j < cList.length; j++) {
        const result = filterCollege[cList[j]!] ?? false;
        if (result) {
          found = true;
        }
      }
      if (!found) continue;
    }

    var search_fields = Object.keys(data[i]!) as ResearchKeysType[];
    var highRel = 0;
    if (keyword.length < 1) {
      highRel = 1;
    } else {
      for (var u = 0; u < search_fields.length; u++) {
        // iterate through each key in dataset
        highRel = Math.max(
          getRelevance(data[i]![search_fields[u]!], keyword),
          highRel
        ); // check if higher match
      }
    }
    if (highRel == 0)
      // no matches...
      continue; // ...skip
    filteredResults.push({ relevance: highRel, entry: data[i]! }); // matches found, add to results and store relevance
  }

  filteredResults.sort(compareRelevance); // sort by relevance

  const filteredFinal = [];

  for (let i = 0; i < filteredResults.length; i++) {
    filteredFinal.push(filteredResults[i]!.entry); // remove relevance since it is no longer needed
  }
  return filteredFinal;
}

function getRelevance(value: string | string[], keyword: string) {
  if (value == undefined) return 0;
  if (!(typeof value === "string") && !(value instanceof String)) return 0; // not string

  if (Array.isArray(value)) {
    value = value.join("");
  }
  value = value.toLowerCase(); // lowercase to make search not case sensitive
  keyword = keyword.toLowerCase();

  var index = value.indexOf(keyword); // index of the keyword
  var word_index = value.indexOf(" " + keyword); // index of the keyword if it is not on the first index, but a word

  if (index == 0)
    // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
    return 3; // highest relevance
  else if (word_index != -1)
    // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
    return 2; // medium relevance
  else if (index != -1)
    // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
    return 1; // low relevance
  else return 0; // no matches, no relevance
}

function compareRelevance(a: filterTupeType, b: filterTupeType) {
  return b.relevance - a.relevance;
}

export default FilterPage;

{
  /* <div className="fixed top-[7vh] right-0 w-5/6 h-[5vh] z-10  bg-gray-300 flex justify-center items-center">
<div className='w-11/12 h-5/6'>
    <div className='bg-white w-full rounded-xl px-4 py-1 h-full flex items-center shadow-sm'>
      <FaSearch className='inline-block text-pink-800'/>
      <input className='px-4 bg-transparent border-none h-full text-xl focus:outline-none' placeholder="Search Opportunities"
      value={input} onChange={(e) => {handleChange(e.target.value)}}></input>
    </div>
    <div>Search Results</div>
</div>
</div> */
}
