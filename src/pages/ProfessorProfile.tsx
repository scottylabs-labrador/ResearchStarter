import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ProfessorType } from "../DataTypes";
import { getDummyResearchForProfessor } from "../data/dummyProfessorResearch";
import { getDevMockProfessor } from "../data/devMockProfessors";
import { professorBioPlainText } from "../utils";
import { useEffectiveSession } from "../lib/useEffectiveSession";
import Card from "../components/Card";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import ProfessorProfileDetails from "../components/profile/ProfessorProfileDetails";
import BioBlurbSection from "../components/profile/BioBlurbSection";
import ResearchAreasSection from "../components/profile/ResearchAreasSection";
import { professorSummaryLine } from "../components/profile/professorSummary";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { Meta } from "../components/ui/Meta";

const professorApiUrl = (param: string) =>
  `http://localhost:5050/professors/${encodeURIComponent(param.trim())}`;

const professorProjectsApiUrl = (param: string) =>
  `http://localhost:5050/opportunities/professor/${encodeURIComponent(param.trim())}`;

const ProfessorProfile = () => {
  const { andrewId } = useParams<{ andrewId: string }>();
  const { data: session } = useEffectiveSession();
  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isOwnProfile = useMemo(() => {
    if (!session?.user?.isProfessor || !andrewId) return false;
    const param = andrewId.trim().toLowerCase();
    const sessionId = session.user.andrewId?.trim().toLowerCase();
    const emailId = session.user.email?.split("@")[0]?.trim().toLowerCase();
    return param === sessionId || param === emailId;
  }, [session, andrewId]);

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
          if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") {
            const mock = getDevMockProfessor(id);
            if (mock) {
              setProfessor(mock);
              setBio(professorBioPlainText(mock.bio));
              return;
            }
          }
          setError(true);
          return;
        }
        const data = await res.json();
        const nextProfessor: ProfessorType = {
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
        };
        setProfessor(nextProfessor);
        setBio(professorBioPlainText(nextProfessor.bio));

        const andrew_id = data.Email.split("@")[0];
        const resProjects = await fetch(professorProjectsApiUrl(andrew_id));
        const projects_data = await resProjects.json();
        console.log(projects_data);
      } catch {
        if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") {
          const mock = getDevMockProfessor(id);
          if (mock) {
            setProfessor(mock);
            setBio(professorBioPlainText(mock.bio));
            return;
          }
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfessor();
  }, [andrewId]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading professor" />
      </main>
    );
  }

  if (error || !professor) {
    return (
      <ProfilePageShell breadcrumbRoot="Professors" breadcrumbCurrent="Not found" breadcrumbIcon={<SchoolOutlinedIcon sx={{ fontSize: 16 }} />}>
        <EmptyState icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />} title="Professor not found." />
      </ProfilePageShell>
    );
  }

  const dummyResearch = getDummyResearchForProfessor(professor.name, andrewId ?? "");

  return (
    <ProfilePageShell
      breadcrumbRoot={isOwnProfile ? "Account" : "Professors"}
      breadcrumbCurrent={isOwnProfile ? "About you" : professor.name}
      breadcrumbIcon={isOwnProfile ? undefined : <SchoolOutlinedIcon sx={{ fontSize: 16 }} />}
    >
      <ProfileHeader
        profileImage={professor.profilePicture}
        name={professor.name}
        summary={professorSummaryLine(professor)}
        readOnly={!isOwnProfile}
      />

      <AboutSection title="Details" className="mt-8">
        <ProfessorProfileDetails college={professor.college} department={professor.department} email={professor.email} />
      </AboutSection>

      <BioBlurbSection initialBio={bio} onSave={isOwnProfile ? setBio : undefined} />

      <ResearchAreasSection tags={professor.tags ?? []} />

      <AboutSection title="Research listings" action={<Meta>{dummyResearch.length} listings</Meta>}>
        <div className="flex flex-col gap-3">
          {dummyResearch.map((research) => (
            <Card key={research._id} research={research} showApplyButton={!isOwnProfile} />
          ))}
        </div>
      </AboutSection>
    </ProfilePageShell>
  );
};

export default ProfessorProfile;
