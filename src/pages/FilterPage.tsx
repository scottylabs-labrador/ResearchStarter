import React, { useMemo, useRef, useState, useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import Tag from "../components/Tag";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Kbd from "../components/ui/Kbd";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useSlashToFocus } from "../components/ui/useSlashToFocus";
import { ResearchType } from "../DataTypes";
import { matchesCompensation, parseContact, toArray } from "../utils";
import { useNavBarHidden } from "../contexts/NavBarContext";
import DEV_MOCK_RESEARCHES from "../data/devMockResearches";

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
  const [searchFocused, setSearchFocused] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  useSlashToFocus(searchRef);

  // College checkboxes
  const [collegeChecks, setCollegeChecks] = useState<Record<string, boolean>>({});

  // Dropdown filters
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedCompensation, setSelectedCompensation] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string[]>([]);

  // Sort
  const [sortBy, setSortBy] = useState<"year" | "time">("time");

  // Infinite scroll
  const CARD_BATCH_LIMIT = 10;
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

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
        // Local-only design preview fallback. Active ONLY when running `vite` in
        // DEV with VITE_DEV_BYPASS_AUTH=true. Stripped from production builds.
        if (
          import.meta.env.DEV &&
          import.meta.env.VITE_DEV_BYPASS_AUTH === "true"
        ) {
          setResearches(DEV_MOCK_RESEARCHES);
        }
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
    selectedDepartment.forEach((dep) => filters.push({ label: dep, type: "department", value: dep }));
    selectedEducation.forEach((edu) => filters.push({ label: edu, type: "education", value: edu }));
    if (selectedCompensation) filters.push({ label: selectedCompensation, type: "compensation", value: selectedCompensation });
    selectedSemester.forEach((sem) => filters.push({ label: sem, type: "semester", value: sem }));
    return filters;
  }, [collegeChecks, selectedDepartment, selectedEducation, selectedCompensation, selectedSemester]);

  const removeFilter = (filter: ActiveFilter) => {
    switch (filter.type) {
      case "college":
        setCollegeChecks((prev) => ({ ...prev, [filter.value]: false }));
        break;
      case "department":
        setSelectedDepartment((prev) => prev.filter((v) => v !== filter.value));
        break;
      case "education":
        setSelectedEducation((prev) => prev.filter((v) => v !== filter.value));
        break;
      case "compensation":
        setSelectedCompensation("");
        break;
      case "semester":
        setSelectedSemester((prev) => prev.filter((v) => v !== filter.value));
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
    setSelectedDepartment([]);
    setSelectedEducation([]);
    setSelectedCompensation("");
    setSelectedSemester([]);
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
    if (selectedDepartment.length > 0) {
      results = results.filter((r) => {
        const deps = Array.isArray(r.department) ? r.department : [];
        return selectedDepartment.some((sel) =>
          deps.some((d) => d.toLowerCase().includes(sel.toLowerCase()))
        );
      });
    }

    // Education filter
    if (selectedEducation.length > 0) {
      results = results.filter((r) =>
        selectedEducation.some((sel) =>
          r.desiredSkillLevel?.toLowerCase().includes(sel.toLowerCase())
        )
      );
    }

    // Compensation filter
    if (selectedCompensation === "Paid" || selectedCompensation === "Unpaid") {
      results = results.filter((r) => matchesCompensation(r.paidUnpaid, selectedCompensation));
    }

    // Semester filter
    if (selectedSemester.length > 0) {
      results = results.filter((r) =>
        selectedSemester.some((sel) =>
          r.anticipatedEndDate?.toLowerCase().includes(sel.toLowerCase())
        )
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

  const visibleCount = (loadedBatches + 1) * CARD_BATCH_LIMIT;
  const hasMore = visibleCount < filteredData.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    // Only show search bar when scrolled to the very top
    setSearchBarHidden(scrollTop > 0);
    if (hasMore && scrollHeight - scrollTop <= clientHeight + 50) {
      setLoadedBatches((prev) => prev + 1);
    }
  };

  const resultLabel = `${filteredData.length} ${filteredData.length === 1 ? "result" : "results"}`;

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

      {/* Moves with transforms only; animating top or height here repaints the whole list every frame. */}
      <div
        className="fixed right-0 top-0 h-screen overflow-hidden bg-canvas transition-[left] duration-200 ease-out motion-reduce:transition-none"
        style={{
          left: sidebarVisible ? "280px" : "0px",
          transform: navHidden ? "translateY(0)" : "translateY(var(--nav-h))",
        }}
      >
        <div
          ref={headerRef}
          className={`absolute left-0 right-0 top-0 z-10 bg-canvas ${
            searchBarHidden ? "pointer-events-none invisible -translate-y-full opacity-0" : "visible translate-y-0 opacity-100"
          }`}
        >
          <div className="px-8 pb-4 pt-6 [padding-right:calc(2rem+10px)]">
            <div className="mb-4 flex items-center gap-3">
              {!sidebarVisible && (
                <Button
                  size="sm"
                  className="ps-2.5"
                  icon={<KeyboardArrowRightIcon sx={{ fontSize: 16, mx: "-4px" }} />}
                  onClick={() => setSidebarVisible(true)}
                >
                  Show filters
                </Button>
              )}
              <div className="flex min-w-0 items-baseline gap-3">
                <h1 className="text-title text-ink">Search</h1>
                {!loading ? <span className="font-mono text-meta text-ink-muted">{resultLabel}</span> : null}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <span aria-hidden="true" className="font-mono text-meta font-medium text-ink-muted">
                  Sort
                </span>
                <SegmentedControl
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: "year", label: "Year" },
                    { value: "time", label: "Time" },
                  ]}
                />
              </div>
            </div>

            <Input
              ref={searchRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                if (searchBarHidden) resultsRef.current?.scrollTo({ top: 0 });
              }}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search for research opportunities..."
              aria-label="Search research opportunities"
              icon={<SearchOutlinedIcon sx={{ fontSize: 18 }} />}
              trailing={!searchFocused && input === "" ? <Kbd>/</Kbd> : null}
            />

            {activeFilters.length > 0 ? (
              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
                {activeFilters.map((filter) => (
                  <Tag key={`${filter.type}-${filter.value}`} keyword={filter.label} onRemove={() => removeFilter(filter)} />
                ))}
                {activeFilters.length >= 2 ? (
                  <Button size="sm" variant="ghost" onClick={handleResetAll}>
                    Clear all
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div
          ref={resultsRef}
          role="region"
          aria-label="Search results"
          className="scrollbar-minimal h-full overflow-y-auto px-8 pb-[calc(2rem+var(--nav-h))]"
          style={{ paddingTop: headerHeight + 8 }}
          onScroll={handleScroll}
        >
          {loading ? (
            <div className="flex justify-center pt-16">
              <Spinner label="Loading opportunities" />
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState
              icon={<SearchOffOutlinedIcon sx={{ fontSize: 20 }} />}
              title="No opportunities match"
              message={activeFilters.length > 0 ? "Try removing a filter" : undefined}
              action={
                activeFilters.length > 0 ? (
                  <Button size="sm" onClick={handleResetAll}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredData
                .slice(0, visibleCount)
                .map((research) => (
                  <Card key={research._id} research={research} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterPage;
