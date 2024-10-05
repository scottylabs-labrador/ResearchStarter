import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";

const NavBar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <>
      <nav className="bg-pink-hippo block h-16 w-full pl-4">
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
          <div className="p-4">
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/search" className={linkClass}>
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
