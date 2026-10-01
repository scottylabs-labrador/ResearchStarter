import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfilePageShell from "../components/profile/ProfilePageShell";
import ProfileDetails from "../components/profile/ProfileDetails";
import BioBlurbSection from "../components/profile/BioBlurbSection";
import InterestsSkillsSection from "../components/profile/InterestsSkillsSection";
import ExperienceList from "../components/profile/ExperienceList";
import AboutSection from "../components/profile/AboutSection";
import { useSession } from "../lib/authClient";
import { Experience } from "../types/Experience";
import { toArray } from "../utils";
import DEV_MOCK_PROFILE, { StudentProfile } from "../data/devMockProfile";

type EditableFields = Partial<Pick<StudentProfile, "bio" | "major" | "interests" | "experiences">>;

const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

const emptyProfile: StudentProfile = {
  name: "",
  email: "",
  major: "",
  class: "",
  colleges: [],
  departments: [],
  bio: "",
  interests: [],
  experiences: [],
};

const normalizeExperiences = (raw: unknown): Experience[] =>
  (Array.isArray(raw) ? raw : []).map((exp: any, i: number) => ({
    id: exp.id ?? `experience-${i}`,
    title: exp.title ?? "",
    professorOrCompany: exp.professorOrCompany ?? "",
    topic: exp.topic ?? "",
    date: exp.date ?? "",
    endDate: exp.endDate ?? "",
    level: exp.level ?? "",
    associatedTags: Array.isArray(exp.associatedTags) ? exp.associatedTags : [],
    description: exp.description ?? "",
  }));

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      if (isDevBypass && !isPending) setProfile(DEV_MOCK_PROFILE);
      return;
    }
    setProfile((prev) => ({
      ...prev,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      image: session.user.image ?? undefined,
      class: (session.user as any).class ?? prev.class,
    }));
  }, [session, isPending]);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        setLoadFailed(false);
        setProfile((prev) => ({
          ...prev,
          class: data.class ?? prev.class,
          major: data.major ?? "",
          colleges: toArray(data.colleges),
          departments: toArray(data.departments),
          bio: data.bio ?? "",
          interests: Array.isArray(data.interests) ? data.interests : [],
          experiences: normalizeExperiences(data.experiences),
        }));
      } catch (err) {
        console.error("Error fetching profile", err);
        setLoadFailed(true);
      }
    };

    fetchProfile();
  }, [userId]);

  const saveProfile = async (updates: EditableFields) => {
    const previous = Object.fromEntries(
      Object.keys(updates).map((key) => [key, profile[key as keyof EditableFields]])
    ) as EditableFields;
    setProfile((prev) => ({ ...prev, ...updates }));
    setSaveFailed(false);
    if (!userId) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      // The server answers 200 with a null body when no user document matched.
      const saved = res.ok ? await res.json() : null;
      if (!saved) throw new Error(res.ok ? "No matching user" : res.statusText);
    } catch (err) {
      console.error("Error saving profile", err);
      setProfile((prev) => ({ ...prev, ...previous }));
      setSaveFailed(true);
    }
  };

  // Only fields that are actually saved count; photo uploads are preview-only.
  const steps = [
    Boolean(profile.major),
    Boolean(profile.bio),
    profile.interests.length > 0,
    profile.experiences.length > 0,
  ];

  return (
    <ProfilePageShell breadcrumbCurrent="About you">
      <ProfileHeader
        profileImage={profile.image}
        name={profile.name}
        major={profile.major}
        class={profile.class}
        email={profile.email}
        completedSteps={steps.filter(Boolean).length}
        totalSteps={steps.length}
      />

      {saveFailed || loadFailed ? (
        <p role="alert" className="mt-6 rounded-control border border-danger/20 bg-danger-bg px-4 py-3 text-small text-danger">
          {saveFailed
            ? "Couldn't save your last change, so it was undone. Check your connection and try again."
            : "Couldn't load your saved profile. Refresh the page before making changes."}
        </p>
      ) : null}

      <AboutSection title="Details" className="mt-8">
        <ProfileDetails
          major={profile.major}
          class={profile.class}
          colleges={profile.colleges}
          email={profile.email}
          onMajorChange={(major) => saveProfile({ major })}
        />
      </AboutSection>

      <BioBlurbSection initialBio={profile.bio} onSave={(bio) => saveProfile({ bio })} />

      <InterestsSkillsSection
        items={profile.interests}
        onAddItem={(item) => saveProfile({ interests: [...profile.interests, item] })}
        onRemoveItem={(item) => saveProfile({ interests: profile.interests.filter((i) => i !== item) })}
      />

      <ExperienceList experiences={profile.experiences} onChange={(experiences) => saveProfile({ experiences })} />
    </ProfilePageShell>
  );
};

export default ProfilePage;
