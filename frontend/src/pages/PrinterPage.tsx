import IPrinter from "../models/IPrinter";
import {DataGrid, GridActionsCellItem, GridColDef} from "@mui/x-data-grid";
import {useContext, useState} from "react";
import {Button, Stack, Tooltip} from "@mui/material";
import EditPrinterDrawer from "../components/drawers/EditPrinterDrawer";
import {LoadingDialog, MessageBannerContext} from "@eforge/eforge-common";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useAPIToken from "../hooks/use-api-token";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddPrintDrawer from "../components/drawers/EditPrintDrawer";
import useFetch from "../hooks/use-fetch";

const apiURL = `${import.meta.env.VITE_BASE_URL}printers`;

const PrinterPage = () => {
  const {data, refresh, isLoading} = useFetch<IPrinter[]>(apiURL);
  const [addAddEditrowId, setAddEditrowId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const bearerToken = useAPIToken();
  const [addPrintDrawerOpen, setAddPrintDrawerOpen] = useState(false);
  const msgCtx = useContext(MessageBannerContext);

  const openDrawer = (id: string) => {
    setAddEditrowId(id);
    setDrawerOpen(true);
  };

  const deletePrinter = async () => {
    setDeleteDialogOpen(false);
    setShowLoadingDialog(true);
    const response = await fetch(`${apiURL}/${addAddEditrowId}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${bearerToken}`},
    });
    if (response.ok) {
      await refresh();
      msgCtx.setSuccessMessage("Printer successfully deleted.");
    } else {
      msgCtx.setErrorMessage("Error occurred deleting printer.");
    }
    setShowLoadingDialog(false);
  };

  const openAddPrintDrawer = (filamentId: string) => {
    setAddEditrowId(filamentId);
    setAddPrintDrawerOpen(true);
  };

  const columns: GridColDef<IPrinter>[] = [
    {field: "id", headerName: "ID", flex: 1},
    {field: "brand", headerName: "Brand", flex: 1},
    {field: "name", headerName: "Name", flex: 1},
    {field: "type", headerName: "Type", flex: 1},
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 150,
      getActions: ({id}) => {
        return [
          <Tooltip title="Add Print" enterDelay={1000}>
            <GridActionsCellItem
              icon={<NoteAddIcon/>}
              label="Add Print"
              onClick={() => openAddPrintDrawer(id.toString())}
            />
          </Tooltip>,
          <Tooltip title="Edit" enterDelay={1000}>
            <GridActionsCellItem
              icon={<EditIcon/>}
              label="Edit"
              onClick={() => openDrawer(id.toString())}
            />
          </Tooltip>,
          <Tooltip title="Delete" enterDelay={1000}>
            <GridActionsCellItem
              icon={<DeleteIcon/>}
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
      <EditPrinterDrawer
        open={drawerOpen}
        onClose={async (updateOccurred) => {
          if (updateOccurred) {
            setShowLoadingDialog(true);
            await refresh();
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
            await refresh();
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
      <LoadingDialog open={isLoading || showLoadingDialog}></LoadingDialog>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
        <Button onClick={() => openDrawer("")}>
          <AddIcon/>
        </Button>
      </Stack>

      {data && (
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {page: 0, pageSize: 10},
            },
          }}
          pageSizeOptions={[10, 50, 100]}
        />
      )}
    </>
  );
};

export default PrinterPage;
