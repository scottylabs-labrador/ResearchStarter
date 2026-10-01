import { useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { Experience } from "../../types/Experience";
import AboutSection from "./AboutSection";
import ExperienceForm from "./ExperienceForm";
import Tag from "../Tag";
import Surface from "../ui/Surface";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { MetaRow } from "../ui/Meta";
import { cx } from "../ui/cx";

type ExperienceDraft = Omit<Experience, "id">;

const emptyDraft: ExperienceDraft = {
  title: "",
  professorOrCompany: "",
  topic: "",
  date: "",
  endDate: "",
  level: "",
  associatedTags: [],
  description: "",
};

const toDraft = (exp: Experience): ExperienceDraft => ({
  title: exp.title,
  professorOrCompany: exp.professorOrCompany,
  topic: exp.topic,
  date: exp.date,
  endDate: exp.endDate,
  level: exp.level,
  associatedTags: exp.associatedTags,
  description: exp.description,
});

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const formatMonth = (value: string) => {
  const match = value.match(/^(\d{4})[-/](\d{1,2})/);
  if (!match) return value;
  return monthFormat.format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1)));
};

const formatRange = (start: string, end: string) => {
  if (!start) return end ? formatMonth(end) : "";
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
};

interface ExperienceListProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

type Editor = { mode: "add" } | { mode: "edit"; id: string };

const ExperienceList = ({ experiences, onChange }: ExperienceListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id ?? null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [initialDraft, setInitialDraft] = useState<ExperienceDraft>(emptyDraft);
  const [draft, setDraft] = useState<ExperienceDraft>(emptyDraft);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const hasExperiences = experiences.length > 0;
  const firstId = experiences[0]?.id ?? null;
  const [autoExpanded, setAutoExpanded] = useState(hasExperiences);

  useEffect(() => {
    if (!autoExpanded && hasExperiences) {
      setExpandedId(firstId);
      setAutoExpanded(true);
    }
  }, [autoExpanded, hasExperiences, firstId]);

  const openEditor = (next: Editor, data: ExperienceDraft) => {
    setInitialDraft(data);
    setDraft(data);
    setEditor(next);
  };

  const handleSave = () => {
    if (!editor || !draft.title.trim()) return;
    if (editor.mode === "add") {
      const id = Date.now().toString();
      onChange([{ id, ...draft }, ...experiences]);
      setExpandedId(id);
    } else {
      onChange(experiences.map((exp) => (exp.id === editor.id ? { ...draft, id: editor.id } : exp)));
    }
    setEditor(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    onChange(experiences.filter((exp) => exp.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <AboutSection
      title="Experience"
      action={
        experiences.length > 0 ? (
          <Button size="sm" variant="ghost" icon={<AddOutlinedIcon sx={{ fontSize: 15 }} />} onClick={() => openEditor({ mode: "add" }, emptyDraft)}>
            Add
          </Button>
        ) : null
      }
    >
      {experiences.length === 0 ? (
        <Surface className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-ink-muted">Labs, internships, and class projects all count.</p>
          <Button size="sm" icon={<AddOutlinedIcon sx={{ fontSize: 15 }} />} onClick={() => openEditor({ mode: "add" }, emptyDraft)}>
            Add experience
          </Button>
        </Surface>
      ) : (
        <Surface className="overflow-hidden p-2">
          {experiences.map((exp, index) => {
            const expanded = expandedId === exp.id;
            const panelId = `experience-panel-${exp.id}`;
            const range = formatRange(exp.date, exp.endDate);
            const initial = (exp.professorOrCompany || exp.title).trim().charAt(0).toUpperCase();

            return (
              <div key={exp.id} className={cx(index > 0 && "mt-1 border-t border-hairline pt-1")}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedId(expanded ? null : exp.id)}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left transition-colors duration-150 ease-out hover:bg-accent-bg/70 focus-visible:bg-accent-bg/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[8px] border border-hairline bg-surface-muted text-[12px] font-semibold text-ink-secondary"
                  >
                    {initial || <WorkOutlineOutlinedIcon sx={{ fontSize: 14 }} />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-x-3 sm:flex-row sm:items-baseline">
                    <span className="truncate text-body font-medium text-ink">{exp.title || "Untitled experience"}</span>
                    {exp.professorOrCompany ? (
                      <span className="truncate text-body text-ink-muted">{exp.professorOrCompany}</span>
                    ) : null}
                    {range ? <span className="mt-0.5 font-mono text-meta text-ink-muted sm:hidden">{range}</span> : null}
                  </span>
                  {range ? <span className="hidden shrink-0 font-mono text-meta text-ink-muted sm:inline">{range}</span> : null}
                  <KeyboardArrowDownIcon
                    aria-hidden="true"
                    sx={{ fontSize: 18 }}
                    className={cx(
                      "shrink-0 text-ink-muted transition-transform duration-200 ease-out motion-reduce:transition-none",
                      expanded && "rotate-180"
                    )}
                  />
                </button>

                <div
                  id={panelId}
                  className={cx(
                    "grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none",
                    expanded ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="mt-1 rounded-[10px] bg-accent-bg/50 px-4 py-4">
                      {exp.topic || exp.level ? (
                        <MetaRow className="mb-3 text-small text-ink-secondary">
                          {exp.topic || ""}
                          {exp.level || ""}
                        </MetaRow>
                      ) : null}
                      {exp.description ? (
                        <p className="w-full whitespace-pre-line text-body text-ink-secondary">{exp.description}</p>
                      ) : (
                        <p className="text-body text-ink-muted">No description yet.</p>
                      )}
                      {exp.associatedTags.length > 0 ? (
                        <div className="mt-4">
                          <p className="mb-2 text-small font-medium text-ink">Skills used</p>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.associatedTags.map((tag) => (
                              <Tag key={tag} keyword={tag} className="!bg-surface ring-1 ring-inset ring-hairline" />
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="-mb-1 -ml-3 mt-4 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
                          onClick={() => openEditor({ mode: "edit", id: exp.id }, toDraft(exp))}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-danger"
                          icon={<DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
                          onClick={() => setDeleteId(exp.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Surface>
      )}

      {editor ? (
        <Modal
          title={editor.mode === "add" ? "Add experience" : "Edit experience"}
          size="lg"
          onClose={() => setEditor(null)}
          className="scrollbar-minimal max-h-[85vh] overflow-y-auto"
          footer={
            <>
              <Button onClick={() => setEditor(null)}>Cancel</Button>
              <Button variant="primary" disabled={!draft.title.trim()} onClick={handleSave}>
                Save
              </Button>
            </>
          }
        >
          <ExperienceForm initialData={initialDraft} onChange={setDraft} />
        </Modal>
      ) : null}

      {deleteId ? (
        <Modal
          title="Delete this experience?"
          onClose={() => setDeleteId(null)}
          footer={
            <>
              <Button onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          }
        >
          It will be removed from your profile.
        </Modal>
      ) : null}
    </AboutSection>
  );
};

export default ExperienceList;
