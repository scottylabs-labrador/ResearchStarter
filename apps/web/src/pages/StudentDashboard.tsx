import { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useSession } from "../lib/authClient";

const ProfilePage = () => {
  const { data: session } = useSession();

  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMajor, setUserMajor] = useState("");
  const [userClass, setUserClass] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    setUserName(session.user.name ?? "");
    setUserEmail(session.user.email ?? "");
    setProfileImage(session.user.image ?? undefined);
    setUserClass((session.user as any).class ?? "");
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}`, {
          credentials: "include",
        });
        if (!res.ok) return;

        const data = await res.json();
        setUserClass(data.class ?? "");
        setUserMajor(data.major ?? "");
      } catch {
        console.log("Error fetching profile");
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  return (
    <main className="min-h-screen max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8">
      <ProfileHeader
        profileImage={profileImage}
        name={userName}
        major={userMajor}
        class={userClass}
        email={userEmail}
        className="mb-20"
      />
      <div className="p-8" />
    </main>
  );
};

export default ProfilePage;