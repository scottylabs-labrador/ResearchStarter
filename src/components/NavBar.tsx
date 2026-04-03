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

const NavBar = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const dashboardLink = session?.user?.isProfessor ? "/professor-dashboard" : "/dashboard";
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
    isActive
      ? "text-black bg-transparent hover:bg-light-color hover:text-black rounded-xl px-2 py-2"
      : "text-black bg-transparent hover:bg-light-color hover:text-black rounded-xl px-2 py-2";

  return (
    <>
      <nav className={`bg-white block h-[10vh] w-full pl-4 fixed z-20 border-nav-border-color border-[1px] transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="grid grid-cols-12 justify-around w-full h-full items-center">
          <div className="col-start-2 h-full flex items-center">
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
            <NavButton
              name="Dashboard"
              Icon={HomeOutlinedIcon}
              links={dashboardLink}
              linkClass={linkClass}
            />
            <NavButton
              name="Search"
              Icon={SearchOutlinedIcon}
              links="/"
              linkClass={linkClass}
            />
          </div>

          {/* User avatar + dropdown */}
          <div className="col-start-11 h-full flex items-center justify-end pr-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-12 h-12 rounded-full bg-brand-300 hover:bg-brand-400 text-sm font-bold transition-colors"
              aria-label="Open user menu"
            >
              {initial}
            </button>

            {open && (
              <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* Identity */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>

                {/* Profile link */}
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <AccountCircleOutlinedIcon fontSize="small" />
                  Manage account
                </NavLink>

                {/* Sign out */}
                <button
                  onClick={() => { setOpen(false); signOut(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
