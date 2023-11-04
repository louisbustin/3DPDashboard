import useSWR from "swr";
import IPrinter from "../models/IPrinter";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import EditPrinterDrawer from "../components/drawers/EditPrinterDrawer";
import LoadingDialog from "../components/LoadingDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import MessageBanner from "../components/MessageBanner";
import useBearerToken from "../hooks/use-bearer-token";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddPrintDrawer from "../components/drawers/AddPrintDrawer";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const PrinterPage = () => {
  const { data, mutate, isLoading, isValidating } = useSWR<IPrinter[]>(apiURL);
  const [addAddEditrowId, setAddEditrowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useBearerToken();
  const [addPrintDrawerOpen, setAddPrintDrawerOpen] = useState(false);

  const openDrawer = (id: string) => {
    setAddEditrowId(id);
    setDrawerOpen(true);
  };

  const deletePrinter = async () => {
    setDeleteDialogOpen(false);
    setShowLoadingDialog(true);
    const response = await fetch(`${apiURL}/${addAddEditrowId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      await mutate();
      setSuccessMessage("Printer successfully deleted.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage("Error occurred deleting printer.");
    }
    setShowLoadingDialog(false);
  };

  const openAddPrintDrawer = (filamentId: string) => {
    setAddEditrowId(filamentId);
    setAddPrintDrawerOpen(true);
  };

  const columns: GridColDef<IPrinter>[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 150,
      getActions: ({ id }) => {
        return [
          <Tooltip title="Add Print" enterDelay={1000}>
            <GridActionsCellItem
              icon={<NoteAddIcon />}
              label="Add Print"
              onClick={() => openAddPrintDrawer(id.toString())}
            />
          </Tooltip>,
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
                setAddEditrowId(id.toString());
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
      <EditPrinterDrawer
        open={drawerOpen}
        onClose={async (updateOccurred) => {
          if (updateOccurred) {
            setShowLoadingDialog(true);
            await mutate();
          }
          setDrawerOpen(false);
          setShowLoadingDialog(false);
        }}
        printerId={addAddEditrowId}
      />
      <AddPrintDrawer
        open={addPrintDrawerOpen}
        onClose={async (updateOccurred) => {
          if (updateOccurred) {
            setShowLoadingDialog(true);
            await mutate();
          }
          setAddPrintDrawerOpen(false);
          setShowLoadingDialog(false);
        }}
        printerId={addAddEditrowId}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => deletePrinter()}
        okText="Yes"
        cancelText="No"
        title="Are you sure?"
      >
        This will completely remove this printer from the database. Understand
        that this operation is not reversible. Are you sure you want to delete
        this printer?
      </ConfirmationDialog>

      <h2>Printers</h2>
      <LoadingDialog
        open={(isLoading && isValidating) || showLoadingDialog}
      ></LoadingDialog>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <Button onClick={() => openDrawer("")}>
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

export default PrinterPage;
