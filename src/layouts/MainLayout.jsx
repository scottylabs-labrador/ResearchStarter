import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  );
};

export default MainLayout;
