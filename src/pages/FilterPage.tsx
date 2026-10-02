import React, { useMemo, useRef, useState, useEffect } from "react";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterSection from "../components/FilterSection";
import Card from "../components/Card";
import Tag from "../components/Tag";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Kbd from "../components/ui/Kbd";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useSlashToFocus } from "../components/ui/useSlashToFocus";
import { ResearchType } from "../DataTypes";
import { matchesCompensation } from "../utils";
import { fetchOpportunities } from "../lib/opportunities";

// The header and the results share one capped, centered column so wide screens keep side margins.
const resultsColumn = "mx-auto w-full max-w-[80rem]";

interface ActiveFilter {
  label: string;
  type: string;
  value: string;
}

const FilterPage = () => {
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useSlashToFocus(searchRef);

  // Each filter toggle unmounts when pressed, so hand focus to the other one instead of dropping it on <body>.
  const showFiltersRef = useRef<HTMLButtonElement>(null);
  const hideFiltersRef = useRef<HTMLButtonElement>(null);
  const moveFocusToToggle = useRef(false);
  const setFiltersVisible = (visible: boolean) => {
    moveFocusToToggle.current = true;
    setSidebarVisible(visible);
  };
  useEffect(() => {
    if (!moveFocusToToggle.current) return;
    moveFocusToToggle.current = false;
    (sidebarVisible ? hideFiltersRef : showFiltersRef).current?.focus();
  }, [sidebarVisible]);

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
        setResearches(await fetchOpportunities());
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
        visible={sidebarVisible}
        onToggleVisible={() => setFiltersVisible(false)}
        hideButtonRef={hideFiltersRef}
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

      {/* Fills the window below the nav; only the results list inside it scrolls. */}
      <div
        className="fixed bottom-0 right-0 top-nav overflow-hidden bg-canvas transition-[left] duration-200 ease-out motion-reduce:transition-none"
        style={{ left: sidebarVisible ? "296px" : "0px" }}
      >
        <div
          ref={headerRef}
          className={`absolute left-0 right-0 top-0 z-10 bg-canvas ${
            // Hidden visually only, so its controls stay in the tab order; focus inside brings it back.
            searchBarHidden
              ? "pointer-events-none -translate-y-full opacity-0 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="pb-4 pl-8 pr-[calc(2rem+10px)] pt-6 xl:pl-12 xl:pr-[calc(3rem+10px)]">
            <div className={resultsColumn}>
              <div className="mb-4 flex items-center gap-3">
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

              {/* With the sidebar hidden, its toggle joins the search row: the heading keeps the column's left edge. */}
              <div className="flex items-center gap-2">
                {!sidebarVisible && (
                  <Button
                    ref={showFiltersRef}
                    className="shrink-0 ps-3"
                    icon={<FilterListOutlinedIcon sx={{ fontSize: 18 }} />}
                    aria-label={activeFilters.length > 0 ? `Show filters, ${activeFilters.length} active` : "Show filters"}
                    onClick={() => setFiltersVisible(true)}
                  >
                    Filters
                    {activeFilters.length > 0 ? (
                      <Badge tone="accent" className="-me-1 font-mono">
                        {activeFilters.length}
                      </Badge>
                    ) : null}
                  </Button>
                )}
                <Input
                  ref={searchRef}
                  containerClassName="min-w-0 flex-1"
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
              </div>

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
        </div>

        <div
          ref={resultsRef}
          role="region"
          aria-label="Search results"
          className="scrollbar-minimal h-full overflow-y-auto px-8 pb-8 xl:px-12"
          style={{ paddingTop: headerHeight + 8 }}
          onScroll={handleScroll}
        >
          <div className={resultsColumn}>
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
      </div>
    </>
  );
};

export default FilterPage;
