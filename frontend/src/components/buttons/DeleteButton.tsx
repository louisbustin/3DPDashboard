import { PropsWithChildren } from "react";
import BaseButton from "./BaseButton";
import { ButtonProps } from "@mui/material";

const DeleteButton = (props: PropsWithChildren<{} | ButtonProps>) => {
  return (
    <BaseButton {...props} variant="outlined" color="error">
      {props.children || "Delete"}
    </BaseButton>
  );
};

export default DeleteButton;
