import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { FaHouse } from "react-icons/fa6";
import { ProfessorType } from "../DataTypes";
import { getDummyResearchForProfessor } from "../data/dummyProfessorResearch";
import { professorBioPlainText } from "../utils";
import Card from "../components/Card";
import ProfileSummary from "../components/profile/ProfileSummary";
import Surface from "../components/ui/Surface";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { Meta } from "../components/ui/Meta";

const professorApiUrl = (param: string) =>
  `http://localhost:5050/professors/${encodeURIComponent(param.trim())}`;

const professorProjectsApiUrl = (param: string) =>
  `http://localhost:5050/opportunities/professor/${encodeURIComponent(param.trim())}`;

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

        let andrew_id = data.Email.split("@")[0];
        const resProjects = await fetch(professorProjectsApiUrl(andrew_id));
        const projects_data = await resProjects.json();
        console.log(projects_data);
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
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading professor" />
      </main>
    );
  }

  if (error || !professor) {
    return (
      <main className="mx-auto max-w-4xl px-8 pt-10">
        <EmptyState icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />} title="Professor not found." />
      </main>
    );
  }

  const dummyResearch = getDummyResearchForProfessor(professor.name, andrewId ?? "");

  const bioText = professorBioPlainText(professor.bio);

  return (
    <main className="mx-auto max-w-4xl px-8 pb-16 pt-10">
      <ProfileSummary
        name={professor.name}
        title={`Professor ${professor.name}`}
        subtitle={professor.email || undefined}
        avatarSrc={professor.profilePicture}
        rows={[
          {
            label: "College",
            value: professor.college.length > 0 ? professor.college.join(", ") : "Not set",
            icon: <FaHouse size={12} />,
          },
          {
            label: "Department",
            value: professor.department.length > 0 ? professor.department.join(", ") : "Not set",
            icon: <ApartmentOutlinedIcon sx={{ fontSize: 14 }} />,
          },
          {
            label: "Email",
            value: <span className="font-mono">{professor.email}</span>,
            icon: <MailOutlinedIcon sx={{ fontSize: 14 }} />,
          },
        ]}
      />

      <section className="mt-10">
        <SectionLabel as="h2" className="mb-2">
          Bio
        </SectionLabel>
        <Surface className="p-5">
          <p className="whitespace-pre-line text-body text-ink-secondary">{bioText || "No bio available."}</p>
        </Surface>
      </section>

      <section className="mt-10">
        <SectionLabel as="h2" className="mb-2" action={<Meta>{dummyResearch.length} listings</Meta>}>
          Research listings
        </SectionLabel>
        <div className="flex flex-col gap-3">
          {dummyResearch.map((research) => (
            <Card key={research._id} research={research} showApplyButton />
          ))}
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <Button>View all</Button>
      </div>
    </main>
  );
};

export default ProfessorProfile;
