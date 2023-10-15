import { PropsWithoutRef } from "react";
import { Alert, AlertTitle } from "@mui/material";

const MessageBanner = (
  props: PropsWithoutRef<{
    successMessage?: string;
    errorMessage?: string;
    infoMessage?: string;
    onClose?: () => void;
  }>
) => {
  return (
    <>
      {props.successMessage && (
        <Alert severity="success" onClose={props.onClose}>
          <AlertTitle>Success</AlertTitle>
          {props.successMessage}
        </Alert>
      )}
      {props.errorMessage && (
        <Alert severity="error" onClose={props.onClose}>
          <AlertTitle>Error</AlertTitle>
          {props.errorMessage}
        </Alert>
      )}
      {props.errorMessage && (
        <Alert severity="info" onClose={props.onClose}>
          <AlertTitle>Info</AlertTitle>
          {props.infoMessage}
        </Alert>
      )}
    </>
  );
};

export default MessageBanner;
