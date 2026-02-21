import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ResearchType, ProfessorType } from "../DataTypes";
import Tag from "../components/Tag";
import { v4 as uuidv4 } from "uuid";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { parseContact, toArray } from "../utils";

const MainPage = () => {
  const [researches, setResearches] = useState<ResearchType[]>([]);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});

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
            description: item.Description || "No description provided.",
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
          })) as ResearchType[];

        setResearches(transformed);
      } catch {
        console.log("Error fetching data");
      }
    };

    fetchResearches();
  }, []);

  useEffect(() => {
    const savedResearch = JSON.parse(localStorage.getItem("savedResearch") || "[]");
    const initial = researches.reduce((acc, research) => {
      acc[research._id] = savedResearch.some((saved: ResearchType) => saved._id === research._id);
      return acc;
    }, {} as { [key: string]: boolean });
    setSavedStates(initial);
  }, [researches]);

  const handleSave = (research: ResearchType) => {
    const savedResearch = JSON.parse(localStorage.getItem("savedResearch") || "[]");
    const isAlreadySaved = savedResearch.some((saved: ResearchType) => saved._id === research._id);

    if (!isAlreadySaved) {
      savedResearch.push(research);
      localStorage.setItem("savedResearch", JSON.stringify(savedResearch));
      setSavedStates(prev => ({ ...prev, [research._id]: true }));
    } else {
      const filtered = savedResearch.filter((saved: ResearchType) => saved._id !== research._id);
      localStorage.setItem("savedResearch", JSON.stringify(filtered));
      setSavedStates(prev => ({ ...prev, [research._id]: false }));
    }
  };

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const [professors, setProfessors] = useState<ProfessorType[]>([]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await fetch("http://localhost:5050/professors/");
        if (!res.ok) return;
        const data: any[] = await res.json();

        const transformed = data
          .filter((item) => item.Name)
          .map((item) => ({
            _id: item._id,
            name: item.Name ?? "",
            department: item.Department ?? [],
            college: item.College ?? [],
            email: item.Email ?? "",
            phoneNumber: item["Phone Number"] ?? "",
            bio: item.Bio ?? {},
            media: item.Media ?? [],
            positions: item.Positions ?? [],
            tags: item.Tags ?? [],
            profilePicture: item["Profile Picture"] ?? "",
          })) as ProfessorType[];

        setProfessors(transformed);
      } catch {
        console.log("Error fetching professors");
      }
    };

    fetchProfessors();
  }, []);

  const BATCH_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;
    if (scrollWidth - scrollLeft <= clientWidth + 100) {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, researches.length));
    }
  };

  const selectedOpportunities = researches.slice(0, visibleCount);

  const [profVisibleCount, setProfVisibleCount] = useState(BATCH_SIZE);

  const handleProfScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;
    if (scrollWidth - scrollLeft <= clientWidth + 100) {
      setProfVisibleCount((prev) => Math.min(prev + BATCH_SIZE, professors.length));
    }
  };

  const selectedProfessors = professors.slice(0, profVisibleCount);

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
      <div className="w-[100vw] px-14 py-16">
        <h1 className="font-jersey font-bold text-4xl mb-8">Selected Research Opportunities:</h1>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" onScroll={handleScroll}>
          {selectedOpportunities.map((research) => (
            <div key={research._id} className="flex-none w-[400px]">
              <div className="w-full h-[300px] bg-light-color rounded-xl p-6 flex flex-col">
                <h3 className="font-jersey font-bold text-4xl mb-2">{research.projectTitle}</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                  {(Array.isArray(research.college) ? research.college : []).map((word) => (
                    <Tag key={uuidv4().concat("col")} keyword={word} />
                  ))}
                  {(Array.isArray(research.department) ? research.department : []).map((word) => (
                    <Tag key={uuidv4().concat("dep")} keyword={word} />
                  ))}
                  {(Array.isArray(research.keywords) ? research.keywords : []).map((word) => (
                    <Tag key={uuidv4().concat("key")} keyword={word} />
                  ))}
                </div>
                <p className="text-sm mb-4 flex-1 overflow-hidden">
                  {truncateDescription(research.description, 300)}
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <NavLink
                    to={`/info/${research._id}`}
                    className="inline-block px-3 py-2 bg-learn-more-color shadow-black shadow-sm text-black rounded hover:bg-opacity-90"
                  >
                    Learn More
                  </NavLink>
                  <button
                    onClick={() => handleSave(research)}
                    className="text-bookmark-color hover:opacity-80"
                  >
                    {savedStates[research._id] ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner Section */}
      <div className="w-[100vw] bg-gradient-to-r from-dark-color to-light-color px-14 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - App Screenshot */}
          <div className="bg-white rounded-xl shadow-lg p-4 overflow-hidden">
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-violet-300 rounded-full text-xs">Dietrich</span>
                <span className="px-3 py-1 bg-violet-300 rounded-full text-xs">Decision Science</span>
                <span className="px-3 py-1 bg-violet-300 rounded-full text-xs">Undergrad</span>
                <span className="px-3 py-1 bg-violet-300 rounded-full text-xs">Topic</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div>
            <h2 className="font-jersey font-bold text-6xl leading-tight mb-6">
              Get information of current CMU Research Opportunities with Ease!
            </h2>
            <p className="text-gray-800 mb-8 leading-relaxed">
              Browse through a curated collection of research opportunities across all CMU colleges
              and departments. Filter by your interests, save opportunities for later, and connect
              directly with professors and lab leads. Whether you're an undergraduate looking for
              your first research experience or a graduate student seeking new collaborations,
              we make it easy to find the perfect match.
            </p>
            <NavLink
              to="/"
              className="inline-block px-6 py-3 te bg-white text-black font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Searching
            </NavLink>
          </div>
        </div>
      </div>

      {/* Professors Section */}
      <div className="w-[100vw] px-14 py-16">
        <h1 className="font-jersey font-bold text-4xl mb-8">Featured Professors:</h1>
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" onScroll={handleProfScroll}>
          {selectedProfessors.map((professor) => (
            <div key={professor._id} className="flex-none w-[300px]">
              <div className="w-full h-[350px] bg-light-color rounded-xl p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                  {professor.profilePicture ? (
                    <img
                      src={professor.profilePicture}
                      alt={professor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PersonIcon className="text-gray-400" style={{ fontSize: '3rem' }} />
                  )}
                </div>
                <h3 className="font-bold text-xl mb-1">{professor.name}</h3>
                {professor.department.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2">{professor.department.join(', ')}</p>
                )}
                <div className="w-full flex gap-2 flex-wrap justify-center mb-3 max-h-24 overflow-y-auto pr-1">
                  {professor.tags?.slice(0, 3).map((tag) => (
                    <Tag
                      key={uuidv4().concat("tag")}
                      keyword={tag}
                    />
                  ))}
                </div>
                <div className="mt-auto space-y-1">
                  {professor.positions && professor.positions.length > 0 && (
                    <p className="text-xs text-gray-500">{professor.positions[0].position}</p>
                  )}
                  {professor.email && (
                    <a
                      href={`mailto:${professor.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {professor.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MainPage;
