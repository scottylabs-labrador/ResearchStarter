import React from "react";
import { NavLink } from "react-router-dom";
import { NavLinkRenderProps } from "react-router-dom";
import { SvgIconProps } from "@mui/material/SvgIcon";

type NavButtonProps = {
  name: string;
  links: string;
  Icon: React.ComponentType<SvgIconProps>;
  linkClass: (props: NavLinkRenderProps) => string;
};

const NavButton = ({ name, links, Icon, linkClass }: NavButtonProps) => {
  return (
    <div className="m-auto px-3">
      <Icon fontSize="large" />
      <NavLink to={links} className={linkClass}>
        {name}
      </NavLink>
    </div>
  );
};

export default NavButton;
