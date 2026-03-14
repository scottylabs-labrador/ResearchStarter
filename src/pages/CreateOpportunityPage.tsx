import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import OpportunityForm from "../components/professor/OpportunityForm";

const emptyOpportunity: Omit<ResearchOpportunity, "id"> = {
  positionTitle: "",
  college: "",
  departmentArea: "",
  educationRequirement: "",
  compensationType: "",
  location: "",
  startSemester: "",
  predictedEndSemester: "",
  limitVisibility: false,
  limitMajor: "",
  allowDirectApplications: false,
  website: "",
  description: "",
  requiredSkills: [],
};

const isFormNonempty = (data: Omit<ResearchOpportunity, "id">): boolean => {
  return (
    data.positionTitle !== "" ||
    data.college !== "" ||
    data.departmentArea !== "" ||
    data.educationRequirement !== "" ||
    data.compensationType !== "" ||
    data.location !== "" ||
    data.startSemester !== "" ||
    data.predictedEndSemester !== "" ||
    data.limitVisibility !== false ||
    data.limitMajor !== "" ||
    data.allowDirectApplications !== false ||
    data.website !== "" ||
    data.description !== "" ||
    data.requiredSkills.length > 0
  );
};

const CreateOpportunityPage = () => {
  const navigate = useNavigate();
  const [newOpportunity, setNewOpportunity] =
    useState<Omit<ResearchOpportunity, "id">>(emptyOpportunity);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleAdd = () => {
    const newId = Date.now().toString();
    const opportunity = { id: newId, ...newOpportunity };
    // TODO: persist the opportunity (e.g. API call)
    console.log("Created opportunity:", opportunity);
    navigate("/professor-dashboard");
  };

  const handleDelete = () => {
    if (isFormNonempty(newOpportunity)) {
      setShowConfirmDelete(true);
    } else {
      navigate("/professor-dashboard");
    }
  };

  const confirmDelete = () => {
    setShowConfirmDelete(false);
    navigate("/professor-dashboard");
  };

  return (
    <div className="flex justify-center min-h-screen bg-white pt-32 px-8 pb-16">
      <div className="max-w-4xl w-full">
        <h3 className="font-jersey text-3xl font-bold mb-4">Create New Opportunity</h3>
        <OpportunityForm
          initialData={newOpportunity}
          onChange={(data) => setNewOpportunity(data)}
        />
        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Add
          </button>
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">You have unsaved changes. Are you sure you want to discard this opportunity?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOpportunityPage;
