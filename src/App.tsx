import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import FilterPage from "./pages/FilterPage";
import Dashboard from "./pages/StudentDashboard";
import SavedPage from "./pages/SavedPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import MainPage from "./pages/MainPage";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import CreateOpportunityPage from "./pages/CreateOpportunityPage";

import InfoPage from "./pages/InfoPage";
import { useSession } from "./lib/authClient";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<FilterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
      <Route path="/professor-dashboard/create-opportunity" element={<CreateOpportunityPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/info/:id" element={<InfoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  return session ? <RouterProvider router={router} /> : <SignInPage />;
};

export default App;
