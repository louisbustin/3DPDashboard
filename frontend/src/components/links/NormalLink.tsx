import { Link } from "@mui/material";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

const NormalLink = (props: PropsWithChildren<{ to: string }>) => {
  const navigate = useNavigate();
  return (
    <Link
      href={props.to}
      onClick={(event) => {
        event.preventDefault();
        navigate(props.to);
      }}
    >
      {props.children}
    </Link>
  );
};

export default NormalLink;
