import {Box, Button, Drawer, Stack, Divider} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {PropsWithChildren} from "react";
import SaveButton from "../buttons/SaveButton";
import CloseIcon from "@mui/icons-material/Close";
import CancelButton from "../buttons/CancelButton";
import DeleteButton from "../buttons/DeleteButton";

const EditDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: () => void;
    onSave?: () => void;
    hideSaveButton?: boolean;
    hideDeleteButton?: boolean;
    hideCancelButton?: boolean;
  }>
) => {
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.onSave) {
      props.onSave();
    }
  };
  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button onClick={props.onClose}>
          <CloseIcon/>
        </Button>
      </Box>
      <Divider light/>
      <Box
        component="form"
        sx={{m: 1, width: "35ch"}}
        onSubmit={onFormSubmit}
      >
        <Grid container spacing={2}>
          <Grid size={{xs: 12}} marginTop={1}>
            {props.children}
          </Grid>
          <Grid size={{xs: 12}}>
            <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
              {!props.hideDeleteButton && <DeleteButton></DeleteButton>}
              {!props.hideCancelButton && (
                <CancelButton onClick={props.onClose}>Cancel</CancelButton>
              )}
              {!props.hideSaveButton && <SaveButton type="submit"/>}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default EditDrawer;
