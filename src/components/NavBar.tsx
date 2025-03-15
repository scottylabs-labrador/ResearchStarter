import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserButton } from "@clerk/clerk-react";
import NavButton from "./NavButton";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

interface linkClassPropt {
  isActive: boolean;
}

const NavBar = () => {
  const linkClass = (isActive: linkClassPropt) =>
    isActive
      ? "text-black bg-transparent hover:bg-light-color hover:text-black rounded-md px-2 py-2"
      : "text-black bg-transparent hover:bg-light-color hover:text-black rounded-md px-2 py-2";

  return (
    <>
      <nav className="bg-white block h-[10vh] w-full pl-4 fixed z-20 shadow-md">
        <div className="flex flex-wrap justify-around items-center w-full h-full">
          <div className="h-4/6 w-2/7 flex items-start">
            {/* Logo */}
            <NavLink className="w-full h-full inline-block" to="/main">
              <img
                className="object-contain relative w-full h-full py-2"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>
          <div className="p-4 text-lg flex gap-x-4">
            <NavButton
              name="Dashboard"
              Icon={HomeOutlinedIcon}
              links="/profile"
              linkClass={linkClass}
            />
            <NavButton
              name="Search"
              Icon={SearchOutlinedIcon}
              links="/"
              linkClass={linkClass}
            />
            <NavButton
              name="Saved"
              Icon={BookmarkBorderOutlinedIcon}
              links="/saved"
              linkClass={linkClass}
            />
          </div>
          <UserButton />
        </div>
      </nav>
      <div className="h-[12vh] w-full "></div>
    </>
  );
};

export default NavBar;
