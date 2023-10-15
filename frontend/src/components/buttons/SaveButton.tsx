import { PropsWithChildren } from "react";
import BaseButton from "./BaseButton";
import { ButtonProps } from "@mui/material";

const SaveButton = (props: PropsWithChildren<{} | ButtonProps>) => {
  return (
    <BaseButton {...props} variant="contained">
      {props.children || "Save"}
    </BaseButton>
  );
};

export default SaveButton;
