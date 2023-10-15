import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { PropsWithChildren } from "react";
import SaveButton from "./buttons/SaveButton";
import CancelButton from "./buttons/CancelButton";

const ConfirmationDialog = (
  props: PropsWithChildren<{
    open: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    title?: string;
    cancelText?: string;
    okText?: string;
  }>
) => {
  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle>{props.title || "Confirm"}</DialogTitle>
        <DialogContent dividers>{props.children}</DialogContent>
        <DialogActions>
          <CancelButton autoFocus onClick={props.onCancel}>
            {props.cancelText || "Cancel"}
          </CancelButton>
          <SaveButton onClick={props.onConfirm}>
            {props.okText || "Ok"}
          </SaveButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
