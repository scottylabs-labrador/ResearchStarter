import React, { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSession, signOut } from "../lib/authClient";
import NavButton from "./NavButton";
import { useNavBarHidden } from "../contexts/NavBarContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NavBar = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const isProfessor = session?.user?.isProfessor ?? false;
  const dashboardLink = isProfessor ? "/professor-dashboard" : "/dashboard";
  const initial = name[0]?.toUpperCase() ?? "?";

  const [open, setOpen] = useState(false);
  const hidden = useNavBarHidden();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition-[color,border-color] duration-150 ease-out active:scale-[0.97] ${
      isActive
        ? "text-tag-dark-color font-semibold border-tag-dark-color"
        : "text-gray-700 font-medium border-transparent hover:text-tag-dark-color hover:border-violet-300"
    }`;

  return (
    <>
      <nav className={`bg-white block h-[10vh] w-full px-8 fixed z-20 border-nav-border-color border-[1px] transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="grid grid-cols-12 justify-around w-full h-full items-center">
          <div className="col-start-1 h-full flex items-center">
            {/* Logo */}
            <NavLink className="w-full h-full inline-block" to="/main">
              <img
                className="object-contain relative w-full h-full py-2"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>
          <div className="p-4 text-base flex justify-center items-center gap-x-2 col-start-5 col-span-4 w-full">
            {isProfessor && (
              <NavButton
                name="Dashboard"
                Icon={HomeOutlinedIcon}
                links={dashboardLink}
                linkClass={linkClass}
              />
            )}
            <NavButton
              name="Search"
              Icon={SearchOutlinedIcon}
              links="/"
              linkClass={linkClass}
            />
          </div>

          {/* User avatar + dropdown */}
          <div className="col-start-11 col-span-2 h-full flex items-center justify-end relative" ref={dropdownRef}>
            {/* Pill-shaped trigger: avatar disc + chevron. The chevron rotation
                makes it immediately clear this is a menu, not a status badge. */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Open user menu"
              aria-expanded={open}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors duration-150 ease-out active:scale-[0.97]"
            >
              <div className="w-8 h-8 rounded-full bg-brand-300 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {initial !== "?" ? initial : <AccountCircleOutlinedIcon fontSize="small" />}
              </div>
              <KeyboardArrowDownIcon
                fontSize="small"
                className={`text-gray-500 transition-transform duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="animate-dropIn origin-top-right absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* Identity */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900 truncate">{name || "Signed in"}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>

                {/* Profile link */}
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 active:scale-[0.97]"
                >
                  <AccountCircleOutlinedIcon fontSize="small" />
                  Manage account
                </NavLink>

                {/* Sign out */}
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 active:scale-[0.97]"
                >
                  <LogoutOutlinedIcon fontSize="small" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-[10vh] w-full"></div>
    </>
  );
};

export default NavBar;
