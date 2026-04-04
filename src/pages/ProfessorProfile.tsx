import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfessorType } from "../DataTypes";
import { getDummyResearchForProfessor } from "../data/dummyProfessorResearch";
import { professorBioPlainText } from "../utils";
import Card from "../components/Card";
import ProfessorPlaceholderImg from "../assets/professor_dashboard_placeholder.png";

const professorApiUrl = (param: string) =>
  `http://localhost:5050/professors/${encodeURIComponent(param.trim())}`;

const ProfessorProfile = () => {
  const { andrewId } = useParams<{ andrewId: string }>();
  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = andrewId?.trim();
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchProfessor = async () => {
      try {
        const res = await fetch(professorApiUrl(id));
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setProfessor({
          _id: data._id,
          name: data.Name ?? "",
          department: Array.isArray(data.Department)
            ? data.Department
            : data.Department
              ? [data.Department]
              : [],
          college: Array.isArray(data.College)
            ? data.College
            : data.College
              ? [data.College]
              : [],
          email: data.Email ?? data.email ?? "",
          phoneNumber: data["Phone Number"],
          bio: data.Bio,
          media: data.Media,
          positions: data.Positions,
          tags: data.Tags,
          profilePicture: data["Profile Picture"],
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfessor();
  }, [andrewId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Professor not found.</p>
      </div>
    );
  }

  const dummyResearch = getDummyResearchForProfessor(
    professor.name,
    andrewId ?? ""
  );

  const bioText = professorBioPlainText(professor.bio);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-32 px-8">
      {/* Header: profile picture + info */}
      <div className="flex flex-row items-start gap-24 max-w-4xl w-full">
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={professor.profilePicture || ProfessorPlaceholderImg}
            alt={professor.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex flex-col pt-2 pb-16">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            Professor {professor.name}
          </h1>

          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl">
            <span className="font-bold text-gray-900 text-right pr-6">
              College
            </span>
            <span className="text-gray-800">
              {professor.college.length > 0
                ? professor.college.join(", ")
                : "Not set"}
            </span>

            <span className="font-bold text-gray-900 text-right pr-6">
              Department
            </span>
            <span className="text-gray-800">
              {professor.department.length > 0
                ? professor.department.join(", ")
                : "Not set"}
            </span>

            <span className="font-bold text-gray-900 text-right pr-6">
              Email
            </span>
            <span className="text-gray-700">{professor.email}</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-4xl w-full border-b border-gray-300 flex justify-center">
        <button className="px-6 py-3 text-gray-900 border-b-2 border-violet-500 font-medium">
          Research Listing
        </button>
      </div>

      {/* Bio section */}
      <div className="max-w-4xl w-full mt-8">
        <h2 className="text-3xl font-extrabold text-black mb-4">Bio</h2>
        <div className="bg-violet-100 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {bioText || "No bio available."}
          </p>
        </div>
      </div>

      {/* Research Listings */}
      <div className="max-w-4xl w-full mt-10">
        <h2 className="text-3xl font-extrabold text-black mb-6">
          Research Listings
        </h2>
        <div className="flex flex-col gap-5">
          {dummyResearch.map((research) => (
            <Card
              key={research._id}
              research={research}
              showApplyButton={true}
            />
          ))}
        </div>
      </div>

      {/* View All button */}
      <div className="max-w-4xl w-full my-10">
        <button className="w-full py-3 bg-violet-500 text-white rounded-lg text-lg font-medium hover:bg-violet-600 transition-colors">
          View All
        </button>
      </div>
    </div>
  );
};

export default ProfessorProfile;
