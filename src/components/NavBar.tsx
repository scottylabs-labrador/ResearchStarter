import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "../lib/authClient";
import { useEffectiveSession } from "../lib/useEffectiveSession";
import NavButton from "./NavButton";
import Logo from "./Logo";
import Avatar from "./ui/Avatar";
import { cx } from "./ui/cx";
import { useNavBarHidden } from "../contexts/NavBarContext";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

const menuItemClass =
  "flex w-full items-center gap-2 px-4 py-2 text-body text-ink-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-ink focus-visible:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "flex h-[36px] items-center gap-2 rounded-control px-3 text-body font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98]",
    focusRing,
    isActive ? "bg-accent-bg text-accent-strong" : "text-ink-secondary hover:bg-accent-bg/50 hover:text-ink"
  );

const NavBar = () => {
  const { data: session } = useEffectiveSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? undefined;
  const isProfessor = session?.user?.isProfessor ?? false;
  const dashboardLink = isProfessor ? "/professor-dashboard" : "/dashboard";

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

  return (
    <>
      <nav
        className={cx(
          "fixed inset-x-0 top-0 z-20 h-nav border-b border-hairline bg-surface motion-reduce:transition-none",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-8">
          <NavLink to="/" aria-label="CMU Research home" className={cx("flex items-center justify-self-start rounded-[6px]", focusRing)}>
            <Logo />
          </NavLink>

          <div className="flex items-center gap-1">
            {isProfessor && (
              <NavButton name="Dashboard" Icon={HomeOutlinedIcon} links={dashboardLink} linkClass={linkClass} />
            )}
            <NavButton name="Search" Icon={SearchOutlinedIcon} links="/" linkClass={linkClass} />
          </div>

          <div className="relative justify-self-end" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Open user menu"
              aria-expanded={open}
              aria-haspopup="menu"
              className={cx(
                "flex items-center gap-1 rounded-full py-1 pl-1 pr-2 transition-colors duration-150 ease-out hover:bg-surface-muted active:scale-[0.98]",
                focusRing
              )}
            >
              <Avatar name={name} src={image} size="sm" />
              <KeyboardArrowDownIcon
                sx={{ fontSize: 18 }}
                className={cx(
                  "text-ink-muted transition-transform duration-200 ease-out",
                  open && "rotate-180"
                )}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-[44px] z-50 w-64 origin-top-right animate-dropIn rounded-surface border border-hairline bg-surface py-1 shadow-popover motion-reduce:animate-none"
              >
                <div className="border-b border-hairline px-4 py-3">
                  <p className="truncate text-body font-medium text-ink">{name || "Signed in"}</p>
                  {email ? <p className="truncate font-mono text-meta text-ink-muted">{email}</p> : null}
                </div>
                <NavLink role="menuitem" to="/profile" onClick={() => setOpen(false)} className={menuItemClass}>
                  <AccountCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  Manage account
                </NavLink>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className={menuItemClass}
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-nav w-full" />
    </>
  );
};

export default NavBar;
