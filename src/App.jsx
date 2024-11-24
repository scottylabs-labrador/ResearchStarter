import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import FilterPage from "./pages/FilterPage";
import DashboardPage from "./pages/DashboardPage";
import SavedPage from "./pages/SavedPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import "./styles/global.css";
import "./styles/animation.css"
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import InfoPage from "./pages/InfoPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<FilterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/info" element={<InfoPage />} />
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
