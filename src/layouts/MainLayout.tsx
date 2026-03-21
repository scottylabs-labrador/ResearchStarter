import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../effects/ScrollToTop";
import Footer from "../components/Footer";
import { NavBarContext } from "../contexts/NavBarContext";

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/" || location.pathname === "/saved";

  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Hide header on scroll down, show on scroll up
  // Uses capture mode so it fires for any scrollable element (e.g. FilterPage's inner div)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target;
      const currentScrollY =
        target instanceof Element ? target.scrollTop : window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, []);

  return (
    <NavBarContext.Provider value={navHidden}>
      <ScrollToTop />
      <NavBar />
      <Outlet />
      {!hideFooter && <Footer />}
    </NavBarContext.Provider>
  );
};

export default MainLayout;
