import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../effects/ScrollToTop";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/" || location.pathname === "/saved";

  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};

export default MainLayout;
