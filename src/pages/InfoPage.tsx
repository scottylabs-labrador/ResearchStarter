import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ResearchType } from "../DataTypes";
import RelatedOpportunities from "../components/RelatedOpportunities";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkIconUnfilled from "@mui/icons-material/BookmarkBorderOutlined";
import Tag from "../components/Tag";
import { v4 as uuidv4 } from "uuid";

const InfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<ResearchType | null>(null);
  const [savedResearch, setSavedResearch] = useState<ResearchType[]>([]);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/research");
        const data = await response.json();
        console.log(data);
        const research = data.find((r: ResearchType) => r.id === id);
        setInfo(research);
      } catch (error) {
        console.error("Error fetching research data:", error);
      }
    };

    const fetchSavedResearch = async () => {
      try {
        const response = await fetch("http://localhost:5001/research");
        const data = await response.json();
        setSavedResearch(data.savedResearch || []);
        const savedStatesMap = (data.savedResearch || []).reduce(
          (acc: { [key: string]: boolean }, research: ResearchType) => {
            acc[research.id] = true;
            return acc;
          },
          {}
        );
        setSavedStates(savedStatesMap);
      } catch (error) {
        console.error("Error fetching saved research:", error);
      }
    };

    fetchData();
    fetchSavedResearch();
  }, [id]);

  const handleSave = (research: ResearchType) => {
    const isAlreadySaved = savedResearch.some(
      (saved: ResearchType) => saved.id === research.id
    );
    if (!isAlreadySaved) {
      const updatedSavedResearch = [...savedResearch, research];
      setSavedResearch(updatedSavedResearch);
      setSavedStates((prev) => ({ ...prev, [research.id]: true }));
      fetch("/studentdata.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ savedResearch: updatedSavedResearch }),
      }).catch((error) => console.error("Error saving research:", error));
    }
  };

  const handleUnsave = (research: ResearchType) => {
    const filteredResearch = savedResearch.filter(
      (saved: ResearchType) => saved.id !== research.id
    );
    setSavedResearch(filteredResearch);
    setSavedStates((prev) => ({ ...prev, [research.id]: false }));
    fetch("/studentdata.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ savedResearch: filteredResearch }),
    }).catch((error) => console.error("Error unsaving research:", error));
  };

  if (!id) {
    return <div>Invalid research ID</div>;
  }

  if (!info) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href={`mailto:${info.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {info.email}
                  </a>
                </p>
                <p>
                  <span className="font-medium">Office Hours:</span>{" "}
                  {info.officeHours}
                </p>
              </div>
            </div>

            {/* Website Card */}
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Website</h2>
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {info.website}
              </a>
            </div>

            {/* Requirements Overview Card */}
            {(info.requestedYear || info.requestedExp || info.timeAvail) && (
              <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">
                  Requirements Overview
                </h2>
                <div className="space-y-4">
                  {info.requestedYear && (
                    <div>
                      <p className="font-medium">Year Level:</p>
                      <p>{info.requestedYear}</p>
                    </div>
                  )}
                  {info.requestedExp && (
                    <div>
                      <p className="font-medium">Experience:</p>
                      <p>{info.requestedExp}</p>
                    </div>
                  )}
                  {info.timeAvail && (
                    <div>
                      <p className="font-medium">Time Commitment:</p>
                      <p>{info.timeAvail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {info.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {info.colleges.map((college) => (
                    <Tag key={uuidv4()} keyword={college} />
                  ))}
                  {info.department.map((dept) => (
                    <Tag key={uuidv4()} keyword={dept} />
                  ))}
                  {info.keywords.map((keyword) => (
                    <Tag key={uuidv4()} keyword={keyword} />
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  savedStates[info.id] ? handleUnsave(info) : handleSave(info)
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {savedStates[info.id] ? (
                  <BookmarkIcon className="text-blue-600" />
                ) : (
                  <BookmarkIconUnfilled className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Main Content */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">
                About the Research
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {info.description}
              </p>
            </div>

            {/* Prior Research Section */}
            {info.pastPapers && info.pastPapers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Prior Research</h2>
                <div className="space-y-4">
                  {info.pastPapers.map((paper, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <p className="text-gray-700">{paper}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Opportunities Section */}
            <RelatedOpportunities
              currentResearch={info}
              allResearch={[]} // This will be populated with actual data
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
