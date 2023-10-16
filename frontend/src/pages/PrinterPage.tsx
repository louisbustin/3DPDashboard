import useSWR from "swr";
import IPrinter from "../models/IPrinter";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import EditPrinterDrawer from "../components/drawers/EditPrinterDrawer";
import LoadingDialog from "../components/LoadingDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import MessageBanner from "../components/MessageBanner";
import useBearerToken from "../hooks/use-bearer-token";

const columns: GridColDef<IPrinter>[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "brand", headerName: "Brand", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
];
const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const PrinterPage = () => {
  const { data, mutate, isLoading, isValidating } = useSWR<IPrinter[]>(apiURL);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [addAddEditrowId, setAddEditrowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useBearerToken();

  const openDrawer = (from: "add" | "edit") => {
    if (from === "add") {
      setAddEditrowId("");
    } else {
      setAddEditrowId(selectedRowId);
    }
    setDrawerOpen(true);
  };

  const deletePrinter = async () => {
    setDeleteDialogOpen(false);
    setShowLoadingDialog(true);
    const response = await fetch(`${apiURL}/${selectedRowId}`, {
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
        <Button onClick={() => openDrawer("add")}>Add</Button>
        <Button
          disabled={selectedRowId === ""}
          onClick={() => openDrawer("edit")}
        >
          Edit
        </Button>
        <Button
          disabled={selectedRowId === ""}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
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
          rowSelection
          onRowSelectionModelChange={(a) =>
            setSelectedRowId(a[0] ? a[0].toString() : "")
          }
        />
      )}
    </>
  );
};

export default PrinterPage;
