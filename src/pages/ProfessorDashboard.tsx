import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorPlaceholderImg from "../assets/professor_dashboard_placeholder.png";
import { useSession } from "../lib/authClient";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import OpportunityForm from "../components/professor/OpportunityForm";

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
    <div className="flex flex-col items-center min-h-screen bg-white pt-32 px-8 pb-16">
      <div className="flex flex-row items-start gap-24 max-w-4xl w-full">

        {/* Professor image */}
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={ProfessorPlaceholderImg}
            alt="Professor John Doe"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Professor info */}
        <div className="flex flex-col pt-2 pb-16">
          <h1 className="text-5xl font-extrabold text-black mb-8 tracking-tight">
            {name}
          </h1>

          <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xl">
            <span className="font-bold text-gray-900">College</span>
            <span className="text-gray-800">{college ?? "Not set"}</span>

            <span className="font-bold text-gray-900">Department</span>
            <span className="text-gray-800">{department ?? "Not set"}</span>

            <span className="font-bold text-gray-900">Email</span>
            <span className="text-gray-700">{email}</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 w-full" />

      {/* Create new research opportunity button */}
      <div className="max-w-4xl w-full mt-8 flex justify-center">
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Add Research Opportunity
          </button>
        )}
      </div>

      {/* Inline create form */}
      {showCreateForm && (
        <div className="max-w-4xl w-full mt-8">
          <h3 className="font-roboto text-3xl font-bold mb-4">Create New Opportunity</h3>
          <OpportunityForm
            initialData={newOpportunity}
            onChange={(data) => setNewOpportunity(data)}
          />
          <div className="flex flex-col gap-3 mt-8">
            {submitError && (
              <p className="text-red-500 text-sm text-center">{submitError}</p>
            )}
            <button
              onClick={handleAdd}
              disabled={!isFormValid(newOpportunity)}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={handleDiscard}
              className="w-full py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Confirm discard modal */}
      {showConfirmDiscard && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Discard Changes</h3>
            <p className="mb-4">You have non-empty form data. Are you sure you want to discard this opportunity?</p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setShowConfirmDiscard(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDiscard}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
