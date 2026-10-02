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
    {/* Icon-only on phones, where the nav has no room for labels. */}
    <span className="max-sm:sr-only">{name}</span>
  </NavLink>
);

export default NavButton;
