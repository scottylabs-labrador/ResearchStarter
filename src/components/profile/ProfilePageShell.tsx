import React from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

interface ProfilePageShellProps {
  breadcrumbRoot?: string;
  breadcrumbCurrent: string;
  breadcrumbIcon?: React.ReactNode;
  children: React.ReactNode;
}

const ProfilePageShell = ({
  breadcrumbRoot = "Account",
  breadcrumbCurrent,
  breadcrumbIcon = <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} />,
  children,
}: ProfilePageShellProps) => (
  // pt-[26px] puts the breadcrumb text 32px under the nav, as on other pages; max-w-3xl keeps bios near 85 characters a line.
  <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-[26px] sm:px-8">
    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-body">
      <span className="-ms-[3px] inline-flex items-center gap-1.5 text-ink-muted">
        {breadcrumbIcon}
        {breadcrumbRoot}
      </span>
      <span aria-hidden="true" className="text-hairline-strong">
        /
      </span>
      <span aria-current="page" className="font-medium text-accent-strong">
        {breadcrumbCurrent}
      </span>
    </nav>
    {children}
  </main>
);

export default ProfilePageShell;
