import React, { memo, useContext, useMemo } from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import { useParams } from "react-router-dom";
import { ResearchKeysType, ResearchType } from "../DataTypes";
import { parseContact, toArray } from "../utils";
import { OptionType } from "../FilterData";
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
  
  // Used for infinite scroll logic
  const CARD_BATCH_LIMIT = 10; // Amount of research opportunities loaded when user scrolls to bottom
  const [loadedBatches, setLoadedBatches] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setLoadedBatches((prev) => prev + 1);
    }
  };

  // Fetches research opportunities from database
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:5050/opportunities/");
        if (!res.ok) {
          const message = `An error occurred: ${res.statusText}`;
          console.error(message);
          return;
        }
        const data: any[] = await res.json();

        const transformedData = data
          .filter(item => item["Project Title"])
          .map(item => ({
            _id: item._id,
            projectTitle: item["Project Title"],
            contact: parseContact(item.Contact),
            department: toArray(item.Department),
            description: item.Description,
            desiredSkillLevel: item["Desired Skill Level"],
            paidUnpaid: item["Paid/Unpaid"],
            position: item.Position,
            prereqs: item.Prereqs,
            relevantLinks: toArray(item["Relevant Links"]),
            source: item.Source,
            timeAdded: item["Time Added"],
            timeCommitment: item["Time Commitment"],
            anticipatedEndDate: item["Anticipated End Date"],
            keywords: toArray(item.Keywords),
            college: toArray(item.College),
          }));
        setResearches(transformedData);
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

  const onSelectedDep = (e: MultiValue<OptionType>): false => {
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

  const onSelectedCollege = (e: MultiValue<OptionType>): false => {
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
    setFilterCollege(temp); // Save the copy to state
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
      <FilterSection
        onChecked={onChecked}
        onSelectedDep={onSelectedDep}
        onSelectedCol={onSelectedCollege}
      />
      <div className="fixed top-[10vh] right-0 w-[80vw] bg-white px-14 pt-7 z-10">
        <div className="text-5xl font-extrabold pb-5">Search</div>
        <div className="w-full">
          <SearchBar input={input} handleChange={handleChange} />
        </div>
        <div>{/*}add in filters (tag, year, time, etc){*/}</div>
      </div>
  
      <div className="fixed top-[30vh] right-0 w-[80vw] h-[70vh] overflow-y-auto px-14 pt-2.5" onScroll={handleScroll}>
        <div className="w-full h-full grid grid-cols-1 items-stretch gap-8">
          {loading ? (
            <>
              <h2>Loading...</h2>
              <Spinner />
            </>
          ) : (
            <>
              {filteredData.slice(0, (loadedBatches + 1) * CARD_BATCH_LIMIT).map((research) => (
                <Card key={research._id} research={research}></Card>
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
      // continue skips the loop, basically skips element bc no match
      if (!found) continue;
    }

    if (!filterCollege["All"]) {
      // college don't match
      let found = false;
      const cList = data[i]!["college"];
      if (cList == undefined) continue;
      for (var j = 0; j < cList.length; j++) {
        const result = filterCollege[cList[j]!] ?? false;
        if (result) {
          found = true;
        }
      }
      if (!found) continue;
    }

    var search_fields = Object.keys(data[i]!);
    var highRel = 0;
    if (keyword.length < 1) {
      highRel = 1;
    } else {
      for (var u = 0; u < search_fields.length; u++) {
        // iterate through each key in dataset
        highRel = Math.max(
          getRelevance((data[i] as any)[search_fields[u]!], keyword),
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

function getRelevance(rawValue: unknown, keyword: string) {
  if (rawValue == undefined) return 0;

  let value: string;

  // Handle arrays by joining into a single string
  if (Array.isArray(rawValue)) {
    value = rawValue.join(" ");
  } else if (typeof rawValue === "string") {
    value = rawValue;
  } else {
    return 0; // not a searchable type
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
