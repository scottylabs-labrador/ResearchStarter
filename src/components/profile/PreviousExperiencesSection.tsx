// Currently an unused feature for the student dashboard.

import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Experience } from "../../types/Experience";
import ExperienceForm from "./ExperienceForm";
import { FaPencil } from "react-icons/fa6";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Modal from "../ui/Modal";
import { Meta, MetaRow } from "../ui/Meta";

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

const iconClass = "shrink-0 text-ink-muted";
const fieldLabel = "font-medium text-ink";

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
    endDate: "",
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
      endDate: "",
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
          <div className="mb-3 flex items-center gap-1">
            <h2 className="text-heading text-ink">Previous Experiences</h2>
            <IconButton aria-label="Edit experiences" onClick={onEditExperiencesClick}>
              <FaPencil size={13} />
            </IconButton>
          </div>
          <div className="space-y-3">
            {experiences.length === 0 ? (
              <p className="text-body text-ink-muted">No previous experiences added yet.</p>
            ) : (
              experiences.map((experience) => (
                <Surface key={experience.id} as="article" interactive className="p-[20px]">
                  <h3 className="mb-2 truncate text-card-title text-ink">{experience.title}</h3>
                  <MetaRow className="mb-2 text-small text-ink-secondary">
                    {experience.professorOrCompany ? (
                      <span className="inline-flex items-center gap-1.5">
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 15 }} className={iconClass} />
                        {experience.professorOrCompany}
                      </span>
                    ) : null}
                    {experience.topic ? (
                      <span className="inline-flex items-center gap-1.5">
                        <AccountBalanceOutlinedIcon sx={{ fontSize: 15 }} className={iconClass} />
                        {experience.topic}
                      </span>
                    ) : null}
                    {experience.level ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MenuBookOutlinedIcon sx={{ fontSize: 15 }} className={iconClass} />
                        {experience.level}
                      </span>
                    ) : null}
                  </MetaRow>
                  {experience.date ? (
                    <Meta icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />} className="mb-3">
                      {experience.date}
                      {experience.endDate ? ` – ${experience.endDate}` : ""}
                    </Meta>
                  ) : null}
                  {experience.associatedTags.length > 0 ? (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {experience.associatedTags.map((tag) => (
                        <Tag key={tag} keyword={tag} />
                      ))}
                    </div>
                  ) : null}
                  <p className="line-clamp-3 text-body text-ink-secondary">
                    {experience.description?.substring(0, 300)}
                    {experience.description?.length > 200 && "..."}
                  </p>
                </Surface>
              ))
            )}
          </div>
        </>
      ) : isEditingAllExperiences ? (
        <div>
          <h3 className="mb-4 text-heading text-ink">Edit all experiences</h3>
          <div className="space-y-3">
            {experiences.map((experience) => (
              <Surface key={experience.id} className="p-4">
                {editingExperienceId === experience.id ? (
                  <>
                    <ExperienceForm
                      initialData={currentEditText!}
                      onChange={(data) => setCurrentEditText({ ...data, id: experience.id })}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setExperienceToDelete(experience.id);
                          setShowConfirmDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => handleSaveEdit(experience.id)}>
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1 text-small text-ink-secondary">
                      <h4 className="text-body font-semibold text-ink">{experience.title}</h4>
                      <p><span className={fieldLabel}>Professor/Company:</span> {experience.professorOrCompany}</p>
                      <p><span className={fieldLabel}>Topic:</span> {experience.topic}</p>
                      <p><span className={fieldLabel}>Date:</span> {experience.date}</p>
                      <p><span className={fieldLabel}>Level:</span> {experience.level}</p>
                      {experience.associatedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {experience.associatedTags.map((tag) => (
                            <Tag key={tag} keyword={tag} />
                          ))}
                        </div>
                      ) : null}
                      <p className="pt-1 leading-relaxed">{experience.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(experience)}>
                      Edit
                    </Button>
                  </div>
                )}
              </Surface>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={onBackToProfileClick}>Back to profile</Button>
            <Button variant="primary" icon={<AddOutlinedIcon sx={{ fontSize: 16 }} />} onClick={onAddExperienceClick}>
              Add new experience
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="mb-4 text-heading text-ink">Create new experience</h3>
          <ExperienceForm initialData={newExperienceText} onChange={(data) => setNewExperienceText(data)} />
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={onCancelAddExperienceClick}>Cancel</Button>
            <Button variant="primary" onClick={handleAddExperience}>
              Save
            </Button>
          </div>
        </div>
      )}
      {showConfirmDeleteModal ? (
        <Modal
          title="Delete this experience?"
          onClose={() => setShowConfirmDeleteModal(false)}
          footer={
            <>
              <Button onClick={() => setShowConfirmDeleteModal(false)}>No</Button>
              <Button variant="danger" onClick={() => experienceToDelete && handleDelete(experienceToDelete)}>
                Yes, delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this experience?
        </Modal>
      ) : null}
    </section>
  );
};

export default PreviousExperiencesSection;
