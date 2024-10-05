import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <>
      <nav>
        <div>
          <div>
            <div>
              {/* <!-- Logo --> */}
              <NavLink to="/">
                <span>CMU Research</span>
              </NavLink>
              <div>
                <div>
                  <NavLink to="/" className={linkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/jobs" className={linkClass}>
                    Search
                  </NavLink>
                  <NavLink to="/add-job" className={linkClass}>
                    Saved
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
