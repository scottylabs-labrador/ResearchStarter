import React, { useState } from "react";
import { Experience } from "../../types/Experience";
import ExperienceForm from "./ExperienceForm";

interface PreviousExperiencesSectionProps {
  initialExperiences?: Experience[];
  onSave?: (experiences: Experience[]) => void;
  onEditExperiencesClick: () => void;
  onBackToProfileClick: () => void;
  isEditingAllExperiences: boolean;
  onAddExperienceClick: () => void;
  onCancelAddExperienceClick: () => void;
  isAddingNewExperience: boolean;
}

const PreviousExperiencesSection = ({
  initialExperiences = [],
  onSave,
  onEditExperiencesClick,
  onBackToProfileClick,
  isEditingAllExperiences,
  onAddExperienceClick,
  onCancelAddExperienceClick,
  isAddingNewExperience,
}: PreviousExperiencesSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [currentEditText, setCurrentEditText] = useState<Experience | null>(null);
  const [newExperienceText, setNewExperienceText] = useState<Omit<Experience, "id">>({
    title: "",
    professorOrCompany: "",
    topic: "",
    date: "",
    level: "",
    associatedTags: [],
    description: "",
  });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);

  const handleSave = () => {
    onSave?.(experiences);
  };

  const handleEditClick = (experience: Experience) => {
    setEditingExperienceId(experience.id);
    setCurrentEditText(experience);
  };

  const handleSaveEdit = (id: string) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...currentEditText!, id: id } : exp))
    );
    setEditingExperienceId(null);
    setCurrentEditText(null);
    handleSave();
  };

  const handleCancelEdit = () => {
    setEditingExperienceId(null);
    setCurrentEditText(null);
  };

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    handleSave();
    setShowConfirmDeleteModal(false);
    setExperienceToDelete(null);
  };

  const handleAddExperience = () => {
    const newId = Date.now().toString(); // Simple unique ID generation
    setExperiences((prev) => [...prev, { id: newId, ...newExperienceText }]);
    setNewExperienceText({
      title: "",
      professorOrCompany: "",
      topic: "",
      date: "",
      level: "",
      associatedTags: [],
      description: "",
    }); // Reset form after adding
    handleSave();
    onCancelAddExperienceClick(); // Close the add experience view
  };

  return (
    <section className="mb-8">
      {!isEditingAllExperiences && !isAddingNewExperience ? (
        <>
          <h2 className="font-jersey text-3xl font-bold mb-4">Previous Experiences</h2>
          <div className="space-y-4 bg-magenta-100 p-4 rounded-md">
            {experiences.length === 0 ? (
              <p className="text-gray-700">No previous experiences added yet.</p>
            ) : (
              experiences.map((experience) => (
                <div key={experience.id} className="rounded-md p-4 relative bg-magenta-100 mb-4">
                  <h3 className="font-jersey text-2xl font-bold">{experience.title}</h3>
                  <p className="text-gray-700">
                    <span className="font-semibold">Professor/Company:</span> {experience.professorOrCompany}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Topic:</span> {experience.topic}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span> {experience.date}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Level:</span> {experience.level}
                  </p>
                  <div className="flex flex-wrap mt-2">
                    {experience.associatedTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-200 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    {experience.description}
                  </p>
                </div>
              ))
            )}
          </div>
          <button
            onClick={onEditExperiencesClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Experiences
          </button>
        </>
      ) : isEditingAllExperiences ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit All Experiences</h3>
          {experiences.map((experience) => (
            <div key={experience.id} className="mb-4 p-4 border rounded-md bg-pink-hippo">
              {editingExperienceId === experience.id ? (
                <>
                  <ExperienceForm
                    initialData={currentEditText!}
                    onChange={(data) => setCurrentEditText({ ...data, id: experience.id })}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setExperienceToDelete(experience.id);
                        setShowConfirmDeleteModal(true);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSaveEdit(experience.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{experience.title}</h3>
                    <p className="text-gray-700"><span className="font-semibold">Professor/Company:</span> {experience.professorOrCompany}</p>
                    <p className="text-gray-700"><span className="font-semibold">Topic:</span> {experience.topic}</p>
                    <p className="text-gray-700"><span className="font-semibold">Date:</span> {experience.date}</p>
                    <p className="text-gray-700"><span className="font-semibold">Level:</span> {experience.level}</p>
                    <div className="flex flex-wrap mt-2">
                      {experience.associatedTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-200 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-2">
                      {experience.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditClick(experience)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={onBackToProfileClick}
            className="mt-4 ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Profile
          </button>
          <button
            onClick={onAddExperienceClick}
            className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Add New Experience
          </button>
        </div>
      ) : (
        // New Add Experience Form Section
        <div className="mt-8">
          <h3 className="font-jersey text-3xl font-bold mb-4">Create New Opportunity</h3>
          {/* Input fields for new experience */}
          <>
            <ExperienceForm
              initialData={newExperienceText}
              onChange={(data) => setNewExperienceText(data)}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={onCancelAddExperienceClick}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExperience}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </>
        </div>
      )}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this experience?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => experienceToDelete && handleDelete(experienceToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PreviousExperiencesSection;
