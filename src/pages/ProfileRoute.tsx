import { Navigate } from "react-router-dom";
import Dashboard from "./StudentDashboard";
import { useEffectiveSession } from "../lib/useEffectiveSession";

const ProfileRoute = () => {
  const { data: session } = useEffectiveSession();
  const user = session?.user;

  if (user?.isProfessor) {
    const andrewId = user.andrewId || user.email?.split("@")[0];
    if (andrewId) {
      return <Navigate to={`/professor/${encodeURIComponent(andrewId)}`} replace />;
    }
  }

  return <Dashboard />;
};

export default ProfileRoute;
