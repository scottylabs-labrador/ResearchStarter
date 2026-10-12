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
    <NavLink to={links} className={linkClass}>
      <Icon fontSize="small" />
      {name}
    </NavLink>
  );
};

export default NavButton;
