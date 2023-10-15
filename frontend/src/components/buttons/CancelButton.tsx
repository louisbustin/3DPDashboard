import { PropsWithChildren } from "react";
import BaseButton from "./BaseButton";
import { ButtonProps } from "@mui/material";

const CancelButton = (props: PropsWithChildren<{} | ButtonProps>) => {
  return (
    <BaseButton {...props} variant="outlined">
      {props.children || "Cancel"}
    </BaseButton>
  );
};

export default CancelButton;
