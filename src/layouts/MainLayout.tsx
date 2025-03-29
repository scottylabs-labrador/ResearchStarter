import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import ScrollToTop from "../effects/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
