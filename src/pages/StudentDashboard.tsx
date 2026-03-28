import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
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

const ProfilePage = ({
  profileImage,
  name,
  major,
  class: userClass,
  email,
  initialInterestsSkills = [],
  // initialBio = "",
  // initialPreviousExperiences = [],
}: ProfilePageProps) => {
  const [items, setItems] = useState<string[]>(initialInterestsSkills);
  // const [bio, setBio] = useState(initialBio);
  // const [previousExperiences, setPreviousExperiences] = useState<Experience[]>(initialPreviousExperiences);
  // const [showPreviousExperiencesEditView, setShowPreviousExperiencesEditView] = useState(false);
  // const [showAddExperienceView, setShowAddExperienceView] = useState(false);

  const handleAddItem = (newItem: string) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems((prevItems) => prevItems.filter((item) => item !== itemToRemove));
  };

  // const handleSaveBio = (newBio: string) => {
  //   setBio(newBio);
  //   console.log("Bio saved:", newBio);
  // };

  // const handleSavePreviousExperiences = (newExperiences: Experience[]) => {
  //   setPreviousExperiences(newExperiences);
  //   console.log("Previous experiences saved:", newExperiences);
  // };

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
        profileImage={profileImage}
        name={name}
        major={major}
        class={userClass}
        email={email}
        className="mb-20"
      />
      <hr className="border-gray-300" />
      <div className="p-8">
        <>
          {/* <BioBlurbSection initialBio={bio} onSave={handleSaveBio} /> */}
          <InterestsSkillsSection
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
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