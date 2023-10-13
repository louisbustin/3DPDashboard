import useSWR from "swr";
import IFilament from "../models/IFilament";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import EditFilamentDrawer from "../components/drawers/EditFilamentDrawer";

const columns: GridColDef<IFilament>[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "brand", headerName: "Brand", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
];
const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const FilamentPage = () => {
  const { data, mutate } = useSWR<IFilament[]>(apiURL);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [addAddEditrowId, setAddEditrowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (from: "add" | "edit") => {
    if (from === "add") {
      setAddEditrowId("");
    } else {
      setAddEditrowId(selectedRowId);
    }
    setDrawerOpen(true);
  };

  return (
    <>
      <EditFilamentDrawer
        open={drawerOpen}
        onClose={() => {
          mutate();
          setDrawerOpen(false);
        }}
        filamentId={addAddEditrowId}
      />
      <h2>Filaments</h2>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <Button onClick={() => openDrawer("add")}>Add</Button>
        <Button
          disabled={selectedRowId === ""}
          onClick={() => openDrawer("edit")}
        >
          Edit
        </Button>
        <Button disabled={selectedRowId === ""}>Delete</Button>
      </Stack>

      {data && (
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          rowSelection
          onRowSelectionModelChange={(a) =>
            setSelectedRowId(a[0] ? a[0].toString() : "")
          }
        />
      )}
    </>
  );
};

export default FilamentPage;
