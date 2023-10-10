import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import "./MenuLink.css";

const MenuLink = (props: PropsWithChildren<{ to: string }>) => {
  return (
    <>
      <NavLink to={props.to}>{props.children}</NavLink>
    </>
  );
};

export default MenuLink;
