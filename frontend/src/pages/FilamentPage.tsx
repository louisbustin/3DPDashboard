import useSWR from "swr";
import IFilament from "../models/IFilament";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import EditFilamentDrawer from "../components/drawers/EditFilamentDrawer";

const columns: GridColDef<IFilament>[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "brand", headerName: "Brand", width: 130 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "type", headerName: "Type", width: 130 },
];
const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const FilamentPage = () => {
  const { data } = useSWR<IFilament[]>(apiURL);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <EditFilamentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <h2>Filaments</h2>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <Button onClick={() => setDrawerOpen(true)}>Add</Button>
        <Button disabled={selectedRowId === ""}>Edit</Button>
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
