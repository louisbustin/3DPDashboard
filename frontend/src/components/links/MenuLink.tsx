import { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import "./MenuLink.css";
import Typography from "@mui/material/Typography";

const MenuLink = (props: PropsWithChildren<{ to: string }>) => {
  return (
    <>
      <Typography>
        <NavLink className="menulink" to={props.to}>
          {props.children}
        </NavLink>
      </Typography>
    </>
  );
};

export default MenuLink;
