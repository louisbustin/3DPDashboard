import useSWR from "swr";
import IFilament from "../models/IFilament";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import EditFilamentDrawer from "../components/drawers/EditFilamentDrawer";
import LoadingDialog from "../components/LoadingDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import MessageBanner from "../components/MessageBanner";
import useAPIToken from "../hooks/use-api-token";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const FilamentPage = () => {
  const { data, mutate, isLoading, isValidating } = useSWR<IFilament[]>(apiURL);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useAPIToken();

  const openDrawer = (id?: string) => {
    setSelectedRowId(id || "");
    setDrawerOpen(true);
  };

  const deleteFilament = async () => {
    setDeleteDialogOpen(false);
    setShowLoadingDialog(true);
    const response = await fetch(`${apiURL}/${selectedRowId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      await mutate();
      setSuccessMessage("Filament successfully deleted.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage("Error occurred deleting filament.");
    }
    setShowLoadingDialog(false);
  };
  const columns: GridColDef<IFilament>[] = [
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "color", headerName: "Color", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 150,
      getActions: ({ id }) => {
        return [
          <Tooltip title="Edit" enterDelay={1000}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => openDrawer(id.toString())}
            />
          </Tooltip>,
          <Tooltip title="Delete" enterDelay={1000}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                setSelectedRowId(id.toString());
                setDeleteDialogOpen(true);
              }}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];
  return (
    <>
      <MessageBanner
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => {
          setSuccessMessage("");
          setErrorMessage("");
        }}
      ></MessageBanner>
      <EditFilamentDrawer
        open={drawerOpen}
        onClose={async (updateOccurred) => {
          if (updateOccurred) {
            setShowLoadingDialog(true);
            await mutate();
          }
          setDrawerOpen(false);
          setShowLoadingDialog(false);
        }}
        filamentId={selectedRowId}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => deleteFilament()}
        okText="Yes"
        cancelText="No"
        title="Are you sure?"
      >
        This will completely remove this filament from the database. Understand
        that this operation is not reversible. Are you sure you want to delete
        this filament?
      </ConfirmationDialog>

      <h2>Filaments</h2>
      <LoadingDialog
        open={(isLoading && isValidating) || showLoadingDialog}
      ></LoadingDialog>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <Button onClick={() => openDrawer()} aria-label="Add">
          <AddIcon />
        </Button>
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
        />
      )}
    </>
  );
};

export default FilamentPage;
