import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../effects/ScrollToTop";
import Footer from "../components/Footer";
import { NavBarContext } from "../contexts/NavBarContext";

function readVerticalScrollY(target: EventTarget): number {
  if (target === document || target === document.documentElement) {
    return window.scrollY;
  }
  if (target instanceof Element) {
    return target.scrollTop;
  }
  return window.scrollY;
}

const SCROLL_HIDE_GRACE_MS = 200;

const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/" || location.pathname === "/saved";

  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const scrollLogicReadyAt = useRef(0);

  // After a route change, full reload, or bfcache restore: show the header and
  // absorb restored scroll positions without treating them as "scroll down".
  useEffect(() => {
    const onPageShow = () => {
      setNavHidden(false);
      scrollLogicReadyAt.current = performance.now() + SCROLL_HIDE_GRACE_MS;
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // Hide header on scroll down, show on scroll up
  // Uses capture mode so it fires for any scrollable element (e.g. FilterPage's inner div)
  useEffect(() => {
    setNavHidden(false);
    scrollLogicReadyAt.current = performance.now() + SCROLL_HIDE_GRACE_MS;
    lastScrollY.current = window.scrollY;

    const handleScroll = (e: Event) => {
      const currentScrollY = readVerticalScrollY(e.target ?? document);
      if (performance.now() < scrollLogicReadyAt.current) {
        lastScrollY.current = currentScrollY;
        return;
      }
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    document.addEventListener("scroll", handleScroll, { capture: true });
    const t = window.setTimeout(() => {
      lastScrollY.current = window.scrollY;
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [location.pathname]);

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
