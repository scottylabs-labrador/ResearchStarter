import React, { useEffect, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useEffectiveSession } from "../lib/useEffectiveSession";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import { ProfessorType } from "../DataTypes";
import { getDevMockProfessor } from "../data/devMockProfessors";
import { professorBioPlainText } from "../utils";
import OpportunityForm from "../components/professor/OpportunityForm";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import ProfessorProfileDetails from "../components/profile/ProfessorProfileDetails";
import BioBlurbSection from "../components/profile/BioBlurbSection";
import ResearchAreasSection from "../components/profile/ResearchAreasSection";
import { professorSummaryLine } from "../components/profile/professorSummary";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Surface from "../components/ui/Surface";

type FormData = Omit<ResearchOpportunity, "source" | "timeAdded" | "enableApply">;

const emptyOpportunity: FormData = {
  projectTitle: "",
  contact: {},
  department: [],
  description: "",
  desiredSkillLevel: "",
  paidUnpaid: "",
  position: "",
  prereqs: [],
  relevantLinks: [],
  timeCommitment: "",
  anticipatedEndDate: "",
  keywords: [],
  colleges: [],
};

const isFormValid = (data: FormData): boolean =>
  data.projectTitle.trim() !== "" &&
  Object.keys(data.contact).length > 0 &&
  data.colleges.length > 0 &&
  data.department.length > 0 &&
  data.paidUnpaid !== "" &&
  data.description.trim() !== "" &&
  data.position.trim() !== "" &&
  data.anticipatedEndDate.trim() !== "";

const isFormNonempty = (data: FormData): boolean =>
  data.projectTitle !== "" ||
  Object.keys(data.contact).length > 0 ||
  data.department.length > 0 ||
  data.description !== "" ||
  data.desiredSkillLevel !== "" ||
  data.paidUnpaid !== "" ||
  data.position !== "" ||
  data.prereqs.length > 0 ||
  data.relevantLinks.length > 0 ||
  data.timeCommitment !== "" ||
  data.anticipatedEndDate !== "" ||
  data.keywords.length > 0 ||
  data.colleges.length > 0;

const ProfessorDashboard = () => {
  const { data: session } = useEffectiveSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const andrewId = session?.user?.andrewId || email.split("@")[0] || "";

  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [bio, setBio] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<FormData>(() => ({
    ...emptyOpportunity,
    contact: name || email ? { [name || email]: email } : {},
  }));
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!andrewId) return;
    const mock = getDevMockProfessor(andrewId);
    if (mock) {
      setProfessor(mock);
      setBio(professorBioPlainText(mock.bio));
    }
  }, [andrewId]);

  const college = professor?.college ?? [];
  const department = professor?.department ?? [];
  const tags = professor?.tags ?? [];

  const defaultOpportunity = (): FormData => ({
    ...emptyOpportunity,
    contact: name || email ? { [name || email]: email } : {},
    department,
    colleges: college,
  });

  const handleAdd = async () => {
    if (!isFormValid(newOpportunity)) return;

    const now = new Date();
    const timeAdded = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
    const opportunity: ResearchOpportunity = {
      ...newOpportunity,
      source: "Created by " + name,
      timeAdded,
      enableApply: false,
    };

    try {
      const res = await fetch("http://localhost:5050/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(opportunity),
      });

      if (!res.ok) throw new Error(await res.text());
      setSubmitError("");
      setNewOpportunity(defaultOpportunity());
      setShowCreateForm(false);
    } catch (err) {
      setSubmitError("Failed to save opportunity. Please try again.");
      console.error(err);
    }
  };

  const handleDiscard = () => {
    if (isFormNonempty(newOpportunity)) {
      setShowConfirmDiscard(true);
    } else {
      setShowCreateForm(false);
    }
  };

  const confirmDiscard = () => {
    setShowConfirmDiscard(false);
    setNewOpportunity(defaultOpportunity());
    setShowCreateForm(false);
  };

  const summary = professor
    ? professorSummaryLine(professor)
    : department.length > 0 || college.length > 0
      ? [...department, ...college].join(" · ")
      : email;

  return (
    <ProfilePageShell
      breadcrumbRoot="Account"
      breadcrumbCurrent="Dashboard"
      breadcrumbIcon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}
    >
      <ProfileHeader
        profileImage={professor?.profilePicture}
        name={name}
        summary={summary}
        readOnly
      />

      <AboutSection title="Details" className="mt-8">
        <ProfessorProfileDetails college={college} department={department} email={email} />
      </AboutSection>

      <BioBlurbSection initialBio={bio} />

      {tags.length > 0 ? <ResearchAreasSection tags={tags} /> : null}

      <AboutSection title="Opportunities">
        {showCreateForm ? (
          <Surface className="p-5">
            <OpportunityForm initialData={newOpportunity} onChange={(data) => setNewOpportunity(data)} />
            {submitError ? (
              <p role="alert" className="mt-6 text-small text-danger">
                {submitError}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button size="sm" onClick={handleDiscard}>
                Discard
              </Button>
              <Button size="sm" variant="primary" onClick={handleAdd} disabled={!isFormValid(newOpportunity)}>
                Add opportunity
              </Button>
            </div>
          </Surface>
        ) : (
          <Surface className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body text-ink-muted">Post a new research opportunity for students to discover.</p>
            <Button size="sm" variant="primary" icon={<AddOutlinedIcon sx={{ fontSize: 15 }} />} onClick={() => setShowCreateForm(true)}>
              Add opportunity
            </Button>
          </Surface>
        )}
      </AboutSection>

      {showConfirmDiscard ? (
        <Modal
          title="Discard this opportunity?"
          footer={
            <>
              <Button onClick={() => setShowConfirmDiscard(false)}>Keep editing</Button>
              <Button variant="danger" onClick={confirmDiscard}>
                Discard
              </Button>
            </>
          }
        >
          The form has unsaved changes. Discarding clears everything you&rsquo;ve entered.
        </Modal>
      ) : null}
    </ProfilePageShell>
  );
};

export default ProfessorDashboard;
