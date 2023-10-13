import { PropsWithChildren } from "react";
import EditDrawer from "./EditDrawer";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";

const EditFilamentDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: () => void;
    filamentId?: string;
  }>
) => {
  return (
    <EditDrawer
      open={props.open}
      onClose={props.onClose}
      hideDeleteButton={!props.filamentId}
    >
      <Stack spacing={2}>
        <h2>{props.filamentId ? "Edit " : "New "}Filament</h2>
        <TextField required id="brand" label="Brand" defaultValue="" />
        <TextField id="name" label="Name" defaultValue="" />
        <TextField id="type" label="Type" defaultValue="" />
      </Stack>
    </EditDrawer>
  );
};

export default EditFilamentDrawer;
