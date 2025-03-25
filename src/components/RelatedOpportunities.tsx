import React, { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ResearchType } from "../DataTypes";
import Tag from "./Tag";
import { v4 as uuidv4 } from "uuid";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";

interface RelatedOpportunitiesProps {
  currentResearch: ResearchType;
  allResearch: ResearchType[];
}

const RelatedOpportunities: React.FC<RelatedOpportunitiesProps> = ({
  currentResearch,
  allResearch,
}) => {
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});

  const calculateSimilarity = (current: ResearchType, other: ResearchType): number => {
    let score = 0;

    // Department match (3 points)
    if (current.department && other.department) {
      const commonDepartments = current.department.filter(dept => 
        other.department?.includes(dept)
      );
      score += commonDepartments.length * 3;
    }

    // College match (2 points)
    if (current.colleges && other.colleges) {
      const commonColleges = current.colleges.filter(college => 
        other.colleges?.includes(college)
      );
      score += commonColleges.length * 2;
    }

    // Keyword match (1 point)
    if (current.keywords && other.keywords) {
      const commonKeywords = current.keywords.filter(keyword => 
        other.keywords?.includes(keyword)
      );
      score += commonKeywords.length;
    }

    // Topic match (1 point)
    if (current.topics && other.topics) {
      const commonTopics = current.topics.filter(topic => 
        other.topics?.includes(topic)
      );
      score += commonTopics.length;
    }

    // Research area match (1 point)
    if (current.researches && other.researches) {
      const commonResearch = current.researches.filter(research => 
        other.researches?.includes(research)
      );
      score += commonResearch.length;
    }

    return score;
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const relatedOpportunities = useMemo(() => {
    // Calculate similarity scores for all research items
    const scoredResearch = allResearch
      .filter(research => research.id !== currentResearch.id)
      .map(research => ({
        ...research,
        similarityScore: calculateSimilarity(currentResearch, research)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5); // Changed from 4 to 5 related opportunities

    return scoredResearch;
  }, [currentResearch, allResearch]);

  const handleSave = (research: ResearchType) => {
    const savedResearch = JSON.parse(localStorage.getItem("savedResearch") || "[]");
    const isAlreadySaved = savedResearch.some((saved: ResearchType) => saved.id === research.id);
    
    if (!isAlreadySaved) {
      savedResearch.push(research);
      localStorage.setItem("savedResearch", JSON.stringify(savedResearch));
      setSavedStates(prev => ({ ...prev, [research.id]: true }));
    } else {
      const filteredResearch = savedResearch.filter((saved: ResearchType) => saved.id !== research.id);
      localStorage.setItem("savedResearch", JSON.stringify(filteredResearch));
      setSavedStates(prev => ({ ...prev, [research.id]: false }));
    }
  };

  // Initialize saved states from localStorage
  useEffect(() => {
    const savedResearch = JSON.parse(localStorage.getItem("savedResearch") || "[]");
    const initialSavedStates = relatedOpportunities.reduce((acc, research) => {
      acc[research.id] = savedResearch.some((saved: ResearchType) => saved.id === research.id);
      return acc;
    }, {} as { [key: string]: boolean });
    setSavedStates(initialSavedStates);
  }, [relatedOpportunities]);

  if (relatedOpportunities.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 px-10">
      <h2 className="text-3xl font-bold mb-8">Related Opportunities</h2>
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {relatedOpportunities.map((research) => (
          <div key={research.id} className="flex-none w-[400px]">
            <div className="fadeIn fadeOut w-full h-[300px] bg-light-color rounded-xl p-6 flex flex-col">
              <h3 className="font-bold text-2xl mb-2">{research.name}</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                {research.colleges?.map((word) => (
                  <Tag key={uuidv4().concat("col")} keyword={word} />
                ))}
                {research.department?.map((word) => (
                  <Tag key={uuidv4().concat("dep")} keyword={word} />
                ))}
                {research.keywords?.map((word) => (
                  <Tag key={uuidv4().concat("key")} keyword={word} />
                ))}
              </div>
              <p className="text-sm mb-4 flex-1 overflow-hidden">
                {truncateDescription(research.description, 120)}
              </p>
              <div className="mt-auto flex justify-between items-center">
                <NavLink 
                  to={`/info/${research.id}`}
                  className="inline-block px-3 py-2 bg-learn-more-color shadow-black shadow-sm text-black rounded hover:bg-opacity-90"
                >
                  Learn More
                </NavLink>
                <button
                  onClick={() => handleSave(research)}
                  className="text-bookmark-color hover:opacity-80"
                >
                  {savedStates[research.id] ? <BookmarkIcon /> : <BookmarkIconUnfilled />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedOpportunities; 