import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import FilterPage from "./pages/FilterPage";
import Dashboard from "./pages/StudentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import MainPage from "./pages/MainPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorProfile from "./pages/ProfessorProfile";

import InfoPage from "./pages/InfoPage";
import { useSession } from "./lib/authClient";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<FilterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Dashboard />} />
      <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
      <Route path="/professor/:andrewId" element={<ProfessorProfile />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/info/:id" element={<InfoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  const { data: session, isPending } = useSession();

  // temporary bypass for auth since database is down, REMEMBER TO REMOVE
  return <RouterProvider router={router} />;

  if (isPending) return null;

  return session ? <RouterProvider router={router} /> : <SignInPage />;
};

export default App;
