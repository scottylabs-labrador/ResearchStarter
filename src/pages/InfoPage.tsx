import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ResearchType } from "../DataTypes";
import { fetchOpportunities, relatedTo } from "../lib/opportunities";
import { useBookmark } from "../lib/useBookmark";
import ResumeUploadPopup from "../components/infopage/ResumeUploadPopup";
import InfoPageHeader from "../components/infopage/InfoPageHeader";
import { InfoContact, InfoDetails } from "../components/infopage/InfoSidebar";
import RelatedOpportunitiesSection from "../components/infopage/RelatedOpportunitiesSection";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SectionLabel from "../components/ui/SectionLabel";
import { cx } from "../components/ui/cx";
import { ArrowBackIcon, OpenInNewIcon } from "../components/ui/icons";
import { linkHoverUnderline } from "../components/ui/linkClass";

const InfoPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [info, setInfo] = useState<ResearchType | null>(null);
  const [related, setRelated] = useState<ResearchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const bookmark = useBookmark(id);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOpportunities()
      .then((opportunities) => {
        if (cancelled) return;
        const found = opportunities.find((item) => item._id === id);
        setInfo(found ?? null);
        setRelated(found ? relatedTo(found, opportunities) : []);
        if (!found) setError("Opportunity not found");
      })
      .catch((err) => {
        console.error("Error fetching opportunity", err);
        if (!cancelled) setError("Couldn’t load this opportunity");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Nothing is uploaded yet: the backend has no endpoint for applications.
  const handleResumeSubmit = (file: File | null) => {
    if (file) alert(`Resume ${file.name} uploaded successfully!`);
    setShowResumePopup(false);
  };

  const backButton = (
    <Button variant="ghost" size="sm" className="-ml-[11px]" icon={<ArrowBackIcon size={10} />} onClick={() => navigate(-1)}>
      Back
    </Button>
  );

  // pt-[22px] plus the Back button's own padding puts the first text 32px under the nav, as on other pages.
  const mainClass = "mx-auto max-w-6xl px-8 pb-16 pt-[22px]";

  if (loading) {
    return (
      <main className={mainClass}>
        {backButton}
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner label="Loading research information" />
        </div>
      </main>
    );
  }

  if (error || !info) {
    return (
      <main className={mainClass}>
        {backButton}
        <EmptyState
          className="mt-8"
          icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />}
          title={error ?? "Research not found"}
          action={<Button onClick={() => navigate(-1)}>Go back</Button>}
        />
      </main>
    );
  }

  return (
    <main className={mainClass}>
      {backButton}

      <InfoPageHeader
        title={info.projectTitle}
        contacts={Object.entries(info.contact)}
        department={info.department}
        college={info.college ?? []}
        tags={info.keywords ?? []}
        isBookmarked={bookmark.saved}
        onBookmarkToggle={bookmark.toggle}
        onApplyClick={() => setShowResumePopup(true)}
      />

      {/* Phones read facts, then the description, then the contact; wide screens put facts and contact beside the text. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
        <InfoDetails info={info} className="lg:col-start-2 lg:row-start-1" />

        <div className="flex min-w-0 flex-col gap-10 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <section>
            <SectionLabel as="h2" className="mb-0.5">
              About this opportunity
            </SectionLabel>
            {info.description ? (
              <p className="max-w-measure whitespace-pre-line break-words text-lead text-ink-secondary">
                {info.description}
              </p>
            ) : (
              <p className="text-body text-ink-muted">No description available.</p>
            )}
          </section>

          {info.prereqs && info.prereqs.length > 0 ? (
            <section>
              <SectionLabel as="h2" className="mb-0.5">
                Prerequisites
              </SectionLabel>
              <ul className="max-w-measure list-disc space-y-1 pl-5 text-lead text-ink-secondary marker:text-ink-muted">
                {info.prereqs.map((prereq) => (
                  <li key={prereq}>{prereq}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {info.relevantLinks && info.relevantLinks.length > 0 ? (
            <section>
              <SectionLabel as="h2" className="mb-0.5">
                Relevant links
              </SectionLabel>
              <ul className="space-y-2">
                {info.relevantLinks.map((link) => (
                  <li key={link} className="min-w-0">
                    <a
                      href={link.startsWith("http") ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx(linkHoverUnderline, "inline-flex max-w-full items-center gap-1 font-mono text-meta text-ink-secondary hover:text-ink")}
                    >
                      <span className="truncate">{link}</span>
                      <OpenInNewIcon size={9} className="shrink-0 -translate-y-[0.5px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <InfoContact contact={info.contact} className="lg:col-start-2 lg:row-start-2 lg:self-start" />
      </div>

      {related.length > 0 ? <RelatedOpportunitiesSection opportunities={related} /> : null}

      <ResumeUploadPopup isOpen={showResumePopup} onClose={() => setShowResumePopup(false)} onSubmit={handleResumeSubmit} />
    </main>
  );
};

export default InfoPage;
