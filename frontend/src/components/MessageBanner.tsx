import { PropsWithoutRef } from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

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
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={props.onClose}
            sx={{ marginTop: 3 }}
          >
            <AlertTitle>Success</AlertTitle>
            {props.successMessage}
          </Alert>
        </Snackbar>
      )}
      {props.errorMessage && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" onClose={props.onClose} sx={{ marginTop: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {props.errorMessage}
          </Alert>
        </Snackbar>
      )}
      {props.errorMessage && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info" onClose={props.onClose} sx={{ marginTop: 3 }}>
            <AlertTitle>Info</AlertTitle>
            {props.infoMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default MessageBanner;
