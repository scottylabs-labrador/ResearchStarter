import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useSession } from "../lib/authClient";
import InterestsSkillsSection from "../components/profile/InterestsSkillsSection";
// import BioBlurbSection from "../components/profile/BioBlurbSection";
// import PreviousExperiencesSection from "../components/profile/PreviousExperiencesSection";
// import { Experience } from "../types/Experience";

interface ProfilePageProps {
  profileImage?: string;
  name?: string;
  major?: string;
  class?: string;
  email?: string;
  initialInterestsSkills?: string[];
  // initialBio?: string;
  // initialPreviousExperiences?: Experience[];
}

const ProfilePage = () => {
  // Current logged in user's information
  const { data: session } = useSession();
  const name = session?.user?.name ?? undefined;
  const email = session?.user?.email ?? undefined;

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const res = await fetch("http://localhost:8000/research");
        const data = await res.json();
      } catch {
        console.log("Error Fetching Data");
      }
    };

    fetchResearches();
  }, []);

  return (
    <main className="min-h-screen max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
      <ProfileHeader
        profileImage={undefined}
        name={name}
        major={undefined}
        class={undefined}
        email={email}
        className="mb-20"
      />
      {/*<hr className="border-gray-300" />*/}
      <div className="p-8">
        <>
          {/* <BioBlurbSection initialBio={bio} onSave={handleSaveBio} /> */}
          {/*<InterestsSkillsSection
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />*/}
        </>

        {/* <PreviousExperiencesSection
          initialExperiences={previousExperiences}
          onSave={handleSavePreviousExperiences}
          onEditExperiencesClick={() => {
            setShowPreviousExperiencesEditView(true);
            setShowAddExperienceView(false);
          }}
          onBackToProfileClick={() => setShowPreviousExperiencesEditView(false)}
          onAddExperienceClick={() => {
            setShowAddExperienceView(true);
            setShowPreviousExperiencesEditView(false);
          }}
          onCancelAddExperienceClick={() => setShowAddExperienceView(false)}
          isEditingAllExperiences={showPreviousExperiencesEditView}
          isAddingNewExperience={showAddExperienceView}
        /> */}
      </div>
    </main>
  );
};

export default ProfilePage;