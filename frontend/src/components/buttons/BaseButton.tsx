import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";

const BaseButton = (props: PropsWithChildren<{} | ButtonProps>) => {
  return <Button {...props}>{props.children}</Button>;
};

export default BaseButton;
