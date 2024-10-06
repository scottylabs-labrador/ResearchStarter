import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

const NavBar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-magenta-dark-hippo hover:bg-magenta-dark-hippo hover:text-white rounded-md px-3 py-2"
      : "text-white bg-magenta-hippo hover:bg-magenta-dark-hippo hover:text-white rounded-md px-3 py-2";

  return (
    <>
      <nav className="bg-pink-hippo block h-[7vh] w-full pl-4 fixed">
        <div className="flex flex-wrap justify-between items-center w-full h-full">
          <div className="h-5/6 w-1/7 flex items-start">
            {/* Logo */}
            <NavLink className="w-full h-full inline-block" to="/">
              <img
                className="object-contain relative w-full h-full"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>
          <div className="p-4 text-lg flex gap-x-4">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/" className={linkClass}>
              Search
            </NavLink>
            <NavLink to="/saved" className={linkClass}>
              Saved
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
