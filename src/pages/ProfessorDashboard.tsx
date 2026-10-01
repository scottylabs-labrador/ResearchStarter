import { useCallback, useEffect, useRef, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { useEffectiveSession } from "../lib/useEffectiveSession";
import { createOpportunity, deleteOpportunity, fetchOpportunities, listingsBy } from "../lib/opportunities";
import { fetchProfessor } from "../lib/professors";
import { ResearchOpportunity } from "../types/ResearchOpportunity";
import { ProfessorType, ResearchType } from "../DataTypes";
import Card from "../components/Card";
import OpportunityForm from "../components/professor/OpportunityForm";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import { professorSummaryLine } from "../components/profile/professorSummary";
import Button, { ButtonLink } from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import IconButton from "../components/ui/IconButton";
import { Meta } from "../components/ui/Meta";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
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

const alertClass = "rounded-control border border-danger/20 bg-danger-bg px-4 py-3 text-small text-danger";

// The backend can list, create and delete a professor's listings; it has no way to edit one or to save profile changes.
const ProfessorDashboard = () => {
  const { data: session } = useEffectiveSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const andrewId = session?.user?.andrewId || email.split("@")[0] || "";

  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [listings, setListings] = useState<ResearchType[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<FormData>(emptyOpportunity);
  const formBaseline = useRef<FormData>(emptyOpportunity);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [pendingDelete, setPendingDelete] = useState<ResearchType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const focusAddButton = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!andrewId) return;
    let cancelled = false;
    fetchProfessor(andrewId)
      .then((record) => {
        if (!cancelled) setProfessor(record);
      })
      .catch((err) => console.error("Error fetching professor", err));
    return () => {
      cancelled = true;
    };
  }, [andrewId]);

  const loadListings = useCallback(async () => {
    if (!andrewId) return;
    try {
      setListings(listingsBy(await fetchOpportunities(), andrewId));
      setLoadFailed(false);
    } catch (err) {
      console.error("Error fetching listings", err);
      setLoadFailed(true);
    }
  }, [andrewId]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  // Add opportunity hides while the form is open, and a deleted card takes its button with it, so focus is moved by hand.
  useEffect(() => {
    if (showCreateForm) formRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
  }, [showCreateForm]);

  useEffect(() => {
    if (!focusAddButton.current || showCreateForm) return;
    focusAddButton.current = false;
    addButtonRef.current?.focus();
  }, [showCreateForm, listings]);

  const college = professor?.college ?? [];
  const department = professor?.department ?? [];

  const openCreateForm = () => {
    const draft: FormData = {
      ...emptyOpportunity,
      contact: name || email ? { [name || email]: email } : {},
      department,
      colleges: college,
    };
    formBaseline.current = draft;
    setNewOpportunity(draft);
    setSubmitError("");
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    focusAddButton.current = true;
    setShowCreateForm(false);
  };

  const handleAdd = async () => {
    if (!isFormValid(newOpportunity) || submitting) return;

    const now = new Date();
    const timeAdded = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
    setSubmitting(true);
    try {
      await createOpportunity({ ...newOpportunity, source: "Created by " + name, timeAdded, enableApply: false });
      closeCreateForm();
      await loadListings();
    } catch (err) {
      console.error(err);
      setSubmitError("Couldn’t post this opportunity. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (JSON.stringify(newOpportunity) !== JSON.stringify(formBaseline.current)) {
      setShowConfirmDiscard(true);
    } else {
      closeCreateForm();
    }
  };

  const confirmDiscard = () => {
    setShowConfirmDiscard(false);
    closeCreateForm();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      await deleteOpportunity(target._id);
      // The deleted card took its delete button with it.
      focusAddButton.current = true;
      setListings((prev) => prev?.filter((listing) => listing._id !== target._id) ?? prev);
      setDeleteError("");
    } catch (err) {
      console.error(err);
      setDeleteError(`Couldn’t delete “${target.projectTitle}”. Check your connection and try again.`);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const summary = professor ? professorSummaryLine(professor) : email;
  const listingCount = listings?.length ?? 0;

  return (
    <ProfilePageShell
      breadcrumbRoot="Account"
      breadcrumbCurrent="Dashboard"
      breadcrumbIcon={<DashboardOutlinedIcon sx={{ fontSize: 16 }} />}
    >
      <ProfileHeader
        profileImage={professor?.profilePicture}
        name={professor?.name || name}
        summary={summary}
        readOnly
        action={
          andrewId ? (
            <ButtonLink size="sm" to={`/professor/${encodeURIComponent(andrewId)}`}>
              View public profile
            </ButtonLink>
          ) : null
        }
      />

      <AboutSection
        title="Your listings"
        className="mt-8"
        action={
          <span className="flex items-center gap-3">
            {listings ? <Meta>{listingCount === 1 ? "1 listing" : `${listingCount} listings`}</Meta> : null}
            {!showCreateForm ? (
              <Button
                ref={addButtonRef}
                size="sm"
                variant="primary"
                icon={<AddOutlinedIcon sx={{ fontSize: 15 }} />}
                onClick={openCreateForm}
              >
                Add opportunity
              </Button>
            ) : null}
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {deleteError ? (
            <p role="alert" className={alertClass}>
              {deleteError}
            </p>
          ) : null}

          {showCreateForm ? (
            <div ref={formRef}>
              <Surface className="p-5">
                <OpportunityForm initialData={newOpportunity} onChange={(data) => setNewOpportunity(data)} />
                {submitError ? (
                  <p role="alert" className={`mt-6 ${alertClass}`}>
                    {submitError}
                  </p>
                ) : null}
                <div className="mt-6 flex justify-end gap-2">
                  <Button size="sm" onClick={handleDiscard}>
                    Discard
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleAdd} disabled={!isFormValid(newOpportunity) || submitting}>
                    Add opportunity
                  </Button>
                </div>
              </Surface>
            </div>
          ) : null}

          {loadFailed ? (
            <p role="alert" className={alertClass}>
              Couldn&rsquo;t load your listings. Refresh the page to try again.
            </p>
          ) : listings === null ? (
            <div className="flex justify-center py-10">
              <Spinner label="Loading your listings" />
            </div>
          ) : listings.length === 0 && !showCreateForm ? (
            <EmptyState
              icon={<PostAddOutlinedIcon sx={{ fontSize: 20 }} />}
              title="No listings yet"
              message="Opportunities you post show up in search for students."
            />
          ) : (
            listings.map((research) => (
              <Card
                key={research._id}
                research={research}
                showBookmark={false}
                actions={
                  <IconButton
                    size="sm"
                    className="-my-1 -me-1.5"
                    aria-label={`Delete ${research.projectTitle}`}
                    title="Delete listing"
                    onClick={() => setPendingDelete(research)}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                }
              />
            ))
          )}
        </div>
      </AboutSection>

      {showConfirmDiscard ? (
        <Modal
          title="Discard this opportunity?"
          onClose={() => setShowConfirmDiscard(false)}
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

      {pendingDelete ? (
        <Modal
          title="Delete this listing?"
          onClose={() => setPendingDelete(null)}
          footer={
            <>
              <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
                Delete listing
              </Button>
            </>
          }
        >
          &ldquo;{pendingDelete.projectTitle}&rdquo; will be removed from search for everyone. This can&rsquo;t be undone.
        </Modal>
      ) : null}
    </ProfilePageShell>
  );
};

export default ProfessorDashboard;
