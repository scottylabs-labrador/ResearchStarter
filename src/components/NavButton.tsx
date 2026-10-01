import React from "react";
import { NavLink, NavLinkRenderProps } from "react-router-dom";

type NavButtonProps = {
  name: string;
  links: string;
  Icon: React.ElementType;
  linkClass: (props: NavLinkRenderProps) => string;
};

const NavButton = ({ name, links, Icon, linkClass }: NavButtonProps) => (
  <NavLink to={links} className={linkClass}>
    <Icon sx={{ fontSize: 18 }} />
    {name}
  </NavLink>
);

export default NavButton;
