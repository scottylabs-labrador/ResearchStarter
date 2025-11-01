import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import FilterPage from "./pages/FilterPage";
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard from "./pages/Dashboard";
import SavedPage from "./pages/SavedPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import MainPage from "./pages/MainPage";

import { SignedIn, SignedOut } from "@clerk/clerk-react";
import InfoPage from "./pages/InfoPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<FilterPage />} />
      <Route path="/profile" element={<StudentDashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/info/:id" element={<InfoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </>
  );
};

export default App;
