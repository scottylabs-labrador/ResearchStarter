import React, { useMemo, useState, useEffect } from "react";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import { ResearchType } from "../DataTypes";
import { parseContact, toArray } from "../utils";
import { useNavBarHidden } from "../contexts/NavBarContext";

type FilterKeysType = { [key: string]: boolean };

interface ActiveFilter {
  label: string;
  type: string;
  value: string;
}

const FilterPage = () => {
  const navHidden = useNavBarHidden();
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // College checkboxes
  const [collegeChecks, setCollegeChecks] = useState<Record<string, boolean>>({});

  // Dropdown filters
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState<"year" | "time">("time");

  // Infinite scroll
  const CARD_BATCH_LIMIT = 10;
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [searchBarHidden, setSearchBarHidden] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // Only show search bar when scrolled to the very top
    setSearchBarHidden(scrollTop > 0);
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setLoadedBatches((prev) => prev + 1);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:5050/opportunities/");
        if (!res.ok) return;
        const data: any[] = await res.json();
        const transformed = data
          .filter((item) => item["Project Title"])
          .map((item) => ({
            _id: item._id,
            projectTitle: item["Project Title"],
            contact: parseContact(item.Contact),
            department: toArray(item.Department),
            description: item.Description,
            desiredSkillLevel: item["Desired Skill Level"],
            paidUnpaid: item["Paid/Unpaid"],
            position: item.Position,
            prereqs: toArray(item.Prereqs),
            relevantLinks: toArray(item["Relevant Links"]),
            source: item.Source,
            timeAdded: item["Time Added"],
            timeCommitment: item["Time Commitment"],
            anticipatedEndDate: item["Anticipated End Date"],
            keywords: toArray(item.Keywords),
            college: toArray(item.College),
          }));
        setResearches(transformed);
      } catch {
        console.log("Error Fetching Data");
      } finally {
        setLoading(false);
      }
    };
    fetchResearches();
  }, []);

  // Build active filters for chip display
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];
    Object.entries(collegeChecks).forEach(([name, checked]) => {
      if (checked && name !== "All") {
        // Abbreviate college names for chips
        const abbr: Record<string, string> = {
          "College of Engineering": "Engineering",
          "College of Fine Arts": "CFA",
          "Dietrich College": "Dietrich",
          "Heinz College": "Heinz",
          "Mellon College of Science": "MCS",
          "School of Computer Science": "SCS",
          "Tepper School of Business": "Tepper",
          "CMU Qatar": "Qatar",
        };
        filters.push({ label: abbr[name] || name, type: "college", value: name });
      }
    });
    if (selectedDepartment) filters.push({ label: selectedDepartment, type: "department", value: selectedDepartment });
    if (selectedEducation) filters.push({ label: selectedEducation, type: "education", value: selectedEducation });
    if (selectedCompensation) filters.push({ label: selectedCompensation, type: "compensation", value: selectedCompensation });
    if (selectedSemester) filters.push({ label: selectedSemester, type: "semester", value: selectedSemester });
    return filters;
  }, [collegeChecks, selectedDepartment, selectedEducation, selectedCompensation, selectedSemester]);

  const removeFilter = (filter: ActiveFilter) => {
    switch (filter.type) {
      case "college":
        setCollegeChecks((prev) => ({ ...prev, [filter.value]: false }));
        break;
      case "department":
        setSelectedDepartment("");
        break;
      case "education":
        setSelectedEducation("");
        break;
      case "compensation":
        setSelectedCompensation("");
        break;
      case "semester":
        setSelectedSemester("");
        break;
    }
  };

  // College handlers
  const handleCollegeCheck = (name: string, checked: boolean) => {
    if (name === "All") {
      const allChecks: Record<string, boolean> = {};
      [
        "All", "College of Engineering", "College of Fine Arts", "Dietrich College",
        "Heinz College", "Mellon College of Science", "School of Computer Science",
        "Tepper School of Business", "CMU Qatar",
      ].forEach((c) => { allChecks[c] = checked; });
      setCollegeChecks(allChecks);
    } else {
      setCollegeChecks((prev) => {
        const next = { ...prev, [name]: checked };
        if (!checked) next["All"] = false;
        return next;
      });
    }
  };

  const handleCollegeReset = () => setCollegeChecks({});

  const handleResetAll = () => {
    setCollegeChecks({});
    setSelectedDepartment("");
    setSelectedEducation("");
    setSelectedCompensation("");
    setSelectedSemester("");
  };

  // Filter + search logic
  const filteredData = useMemo(() => {
    let results = researches;

    // College filter
    const activeColleges = Object.entries(collegeChecks)
      .filter(([name, checked]) => checked && name !== "All")
      .map(([name]) => name);
    if (activeColleges.length > 0) {
      results = results.filter((r) => {
        const rColleges = Array.isArray(r.college) ? r.college : [];
        return rColleges.some((c) =>
          activeColleges.some((ac) => c.toLowerCase().includes(ac.toLowerCase()))
        );
      });
    }

    // Department filter
    if (selectedDepartment) {
      results = results.filter((r) => {
        const deps = Array.isArray(r.department) ? r.department : [];
        return deps.some((d) => d.toLowerCase().includes(selectedDepartment.toLowerCase()));
      });
    }

    // Education filter
    if (selectedEducation) {
      results = results.filter((r) =>
        r.desiredSkillLevel?.toLowerCase().includes(selectedEducation.toLowerCase())
      );
    }

    // Compensation filter
    if (selectedCompensation) {
      results = results.filter((r) =>
        r.paidUnpaid?.toLowerCase().includes(selectedCompensation.toLowerCase())
      );
    }

    // Semester filter
    if (selectedSemester) {
      results = results.filter((r) =>
        r.anticipatedEndDate?.toLowerCase().includes(selectedSemester.toLowerCase())
      );
    }

    // Search keyword
    if (input.trim()) {
      const keyword = input.trim().toLowerCase();
      results = results.filter((r) => {
        const searchable = [
          r.projectTitle,
          r.description,
          ...(r.department || []),
          ...(r.keywords || []),
          ...(r.college || []),
          r.position,
          r.desiredSkillLevel,
          ...Object.keys(r.contact || {}),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(keyword);
      });
    }

    // Sort
    if (sortBy === "time") {
      results = [...results].sort((a, b) => {
        const ta = a.timeAdded || "";
        const tb = b.timeAdded || "";
        return tb.localeCompare(ta);
      });
    }

    return results;
  }, [researches, collegeChecks, selectedDepartment, selectedEducation, selectedCompensation, selectedSemester, input, sortBy]);

  const contentLeft = sidebarVisible ? "240px" : "0px";

  return (
    <>
      <FilterSection
        navHidden={navHidden}
        visible={sidebarVisible}
        onToggleVisible={() => setSidebarVisible(false)}
        collegeChecks={collegeChecks}
        onCollegeCheck={handleCollegeCheck}
        onCollegeReset={handleCollegeReset}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedEducation={selectedEducation}
        onEducationChange={setSelectedEducation}
        selectedCompensation={selectedCompensation}
        onCompensationChange={setSelectedCompensation}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        onResetAll={handleResetAll}
      />

      {/* Main content area */}
      <div
        className="fixed right-0 bg-white transition-all duration-300 overflow-hidden flex flex-col"
        style={{
          top: navHidden ? 0 : "10vh",
          left: contentLeft,
          height: navHidden ? "100vh" : "90vh",
        }}
      >
        {/* Header: search bar + filters + sort — collapses on scroll like the navbar */}
        <div
          className={`px-10 pt-6 pb-4 transition-all duration-300 overflow-hidden ${
            searchBarHidden ? "max-h-0 pt-0 pb-0 opacity-0" : "max-h-[300px] opacity-100"
          }`}
        >
          {/* Show sidebar button when hidden */}
          <div className="flex items-center gap-4 mb-4">
            {!sidebarVisible && (
              <button
                onClick={() => setSidebarVisible(true)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-300"
              >
                <span className="text-xs">›</span> Filter
              </button>
            )}
            <h1 className="text-4xl font-extrabold">Search</h1>
          </div>

          <div className="w-full mb-3">
            <SearchBar input={input} handleChange={setInput} />
          </div>

          {/* Active filter chips + sort */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={`${filter.type}-${filter.value}`}
                  onClick={() => removeFilter(filter)}
                  className="flex items-center gap-1 px-3 py-1 bg-brand-50 border border-purple-300 rounded-full text-sm text-purple-700 hover:bg-purple-100"
                >
                  {filter.label}
                  <span className="ml-1 text-xs font-bold">×</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 flex-shrink-0">
              <button
                onClick={() => setSortBy("year")}
                className={`flex items-center gap-1 ${sortBy === "year" ? "text-gray-900 font-medium" : ""}`}
              >
                Year <span className="text-xs">▼</span>
              </button>
              <button
                onClick={() => setSortBy("time")}
                className={`flex items-center gap-1 ${sortBy === "time" ? "text-gray-900 font-medium" : ""}`}
              >
                Time <span className="text-xs">▼</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className="px-10 pb-6 overflow-y-auto flex-1"
          onScroll={handleScroll}
        >
          <div className="flex flex-col gap-5">
            {loading ? (
              <div className="flex flex-col items-center pt-10">
                <h2>Loading...</h2>
                <Spinner />
              </div>
            ) : filteredData.length === 0 ? (
              <p className="text-gray-500 text-center pt-10">No research opportunities found.</p>
            ) : (
              filteredData
                .slice(0, (loadedBatches + 1) * CARD_BATCH_LIMIT)
                .map((research) => <Card key={research._id} research={research} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPage;
