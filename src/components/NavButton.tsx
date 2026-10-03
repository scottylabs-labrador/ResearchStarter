import React from "react";
import { NavLink, NavLinkRenderProps } from "react-router-dom";
import { IconProps } from "./ui/icons";

type NavButtonProps = {
  name: string;
  links: string;
  Icon: React.ComponentType<IconProps>;
  iconSize: number;
  linkClass: (props: NavLinkRenderProps) => string;
};

const NavButton = ({ name, links, Icon, iconSize, linkClass }: NavButtonProps) => (
  <NavLink to={links} className={linkClass}>
    <Icon size={iconSize} />
    {/* Icon-only on phones, where the nav has no room for labels. */}
    <span className="max-sm:sr-only">{name}</span>
  </NavLink>
);

export default NavButton;
