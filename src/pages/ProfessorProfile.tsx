import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { ProfessorType, ResearchType } from "../DataTypes";
import { professorBioPlainText } from "../utils";
import { useEffectiveSession } from "../lib/useEffectiveSession";
import { fetchOpportunities, listingsBy } from "../lib/opportunities";
import { fetchProfessor } from "../lib/professors";
import Card from "../components/Card";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import ProfessorProfileDetails from "../components/profile/ProfessorProfileDetails";
import BioBlurbSection from "../components/profile/BioBlurbSection";
import ResearchAreasSection from "../components/profile/ResearchAreasSection";
import { professorSummaryLine } from "../components/profile/professorSummary";
import Alert from "../components/ui/Alert";
import { ButtonLink } from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { SchoolIcon } from "../components/ui/icons";
import { Meta } from "../components/ui/Meta";

const ProfessorProfile = () => {
  const { andrewId } = useParams<{ andrewId: string }>();
  const { data: session } = useEffectiveSession();
  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [opportunities, setOpportunities] = useState<ResearchType[] | null>(null);
  const [listingsFailed, setListingsFailed] = useState(false);

  const isOwnProfile = useMemo(() => {
    if (!session?.user?.isProfessor || !andrewId) return false;
    const param = andrewId.trim().toLowerCase();
    const sessionId = session.user.andrewId?.trim().toLowerCase();
    const emailId = session.user.email?.split("@")[0]?.trim().toLowerCase();
    return param === sessionId || param === emailId;
  }, [session, andrewId]);

  useEffect(() => {
    const id = andrewId?.trim();
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchProfessor(id)
      .then((record) => {
        if (cancelled) return;
        if (!record) {
          setError(true);
          return;
        }
        setProfessor(record);
        setBio(professorBioPlainText(record.bio));
      })
      .catch((err) => {
        console.error("Error fetching professor", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [andrewId]);

  // Fetched alongside the professor rather than after; filtered once both have arrived.
  useEffect(() => {
    let cancelled = false;
    fetchOpportunities()
      .then((result) => {
        if (!cancelled) setOpportunities(result);
      })
      .catch((err) => {
        console.error("Error fetching listings", err);
        if (!cancelled) setListingsFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The record's email is canonical; the URL may hold an email or a record id instead of an Andrew ID.
  const owner = professor ? professor.email.split("@")[0] || andrewId || "" : "";
  const listings = useMemo(
    () => (professor && opportunities ? listingsBy(opportunities, owner) : null),
    [professor, opportunities, owner]
  );

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Loading professor" />
      </main>
    );
  }

  if (error || !professor) {
    return (
      <ProfilePageShell breadcrumbRoot="Professors" breadcrumbCurrent="Not found" breadcrumbIcon={<SchoolIcon size={12} />}>
        <EmptyState icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} />} title="Professor not found" titleAs="h1" />
      </ProfilePageShell>
    );
  }

  const listingCount = listings?.length ?? 0;

  return (
    <ProfilePageShell
      breadcrumbRoot={isOwnProfile ? "Account" : "Professors"}
      breadcrumbCurrent={isOwnProfile ? "Public profile" : professor.name}
      breadcrumbIcon={isOwnProfile ? undefined : <SchoolIcon size={12} />}
    >
      <ProfileHeader
        profileImage={professor.profilePicture}
        name={professor.name}
        summary={professorSummaryLine(professor)}
        readOnly
        action={
          isOwnProfile ? (
            <ButtonLink size="sm" to="/professor-dashboard">
              Manage listings
            </ButtonLink>
          ) : null
        }
      />

      <AboutSection title="Details" className="mt-8">
        <ProfessorProfileDetails college={professor.college} department={professor.department} email={professor.email} />
      </AboutSection>

      <BioBlurbSection initialBio={bio} />

      <ResearchAreasSection tags={professor.tags ?? []} />

      <AboutSection
        title="Research listings"
        action={listings ? <Meta>{listingCount === 1 ? "1 listing" : `${listingCount} listings`}</Meta> : null}
      >
        {listingsFailed ? (
          <Alert>
            Couldn&rsquo;t load research listings. Refresh the page to try again.
          </Alert>
        ) : listings === null ? (
          <div className="flex justify-center py-10">
            <Spinner label="Loading research listings" />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState icon={<PostAddOutlinedIcon sx={{ fontSize: 20 }} />} title="No open listings right now" />
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map((research) => (
              <Card key={research._id} research={research} showApplyButton={!isOwnProfile} showBookmark={!isOwnProfile} />
            ))}
          </div>
        )}
      </AboutSection>
    </ProfilePageShell>
  );
};

export default ProfessorProfile;
