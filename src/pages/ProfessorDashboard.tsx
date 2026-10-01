import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { FaHouse } from "react-icons/fa6";
import { useSession } from "../lib/authClient";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import OpportunityForm from "../components/professor/OpportunityForm";
import ProfileSummary from "../components/profile/ProfileSummary";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

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

const isFormValid = (data: FormData): boolean => {
  return (
    data.projectTitle.trim() !== "" &&
    Object.keys(data.contact).length > 0 &&
    data.colleges.length > 0 &&
    data.department.length > 0 &&
    data.paidUnpaid !== "" &&
    data.description.trim() !== "" &&
    data.position.trim() !== "" &&
    data.anticipatedEndDate.trim() !== ""
  );
};

const isFormNonempty = (data: FormData): boolean => {
  return (
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
    data.colleges.length > 0
  );
};

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const college = undefined;
  const department = undefined;

  const defaultOpportunity = (): FormData => ({
    ...emptyOpportunity,
    contact: name || email ? { [name || email]: email } : {},
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<FormData>(defaultOpportunity);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    // Attempts to add the opportunity to the database
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

  return (
    <main className="mx-auto max-w-4xl px-8 pb-16 pt-10">
      <ProfileSummary
        name={name}
        title={name || "Your Name"}
        subtitle={email || undefined}
        rows={[
          { label: "College", value: college ?? "Not set", icon: <FaHouse size={12} /> },
          { label: "Department", value: department ?? "Not set", icon: <ApartmentOutlinedIcon sx={{ fontSize: 14 }} /> },
          { label: "Email", value: email ? <span className="font-mono">{email}</span> : "Not set", icon: <MailOutlinedIcon sx={{ fontSize: 14 }} /> },
        ]}
      />

      {!showCreateForm ? (
        <div className="mt-8 flex justify-center">
          <Button variant="primary" icon={<AddOutlinedIcon sx={{ fontSize: 16 }} />} onClick={() => setShowCreateForm(true)}>
            Add research opportunity
          </Button>
        </div>
      ) : (
        <section className="mt-10">
          <h2 className="mb-5 text-heading text-ink">Create new opportunity</h2>
          <OpportunityForm initialData={newOpportunity} onChange={(data) => setNewOpportunity(data)} />
          {submitError ? (
            <p role="alert" className="mt-6 text-small text-danger">
              {submitError}
            </p>
          ) : null}
          <div className="mt-8 flex justify-end gap-2">
            <Button onClick={handleDiscard}>Discard</Button>
            <Button variant="primary" onClick={handleAdd} disabled={!isFormValid(newOpportunity)}>
              Add opportunity
            </Button>
          </div>
        </section>
      )}

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
    </main>
  );
};

export default ProfessorDashboard;
