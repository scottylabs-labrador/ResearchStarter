import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../effects/ScrollToTop";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/" || location.pathname === "/saved";

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
