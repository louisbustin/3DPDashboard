import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import IPrint, { getDefaultPrint } from "../../models/IPrint";
import ImageHoverZoom from "../ImageHoverZoom";
import moment from "moment";
import { Fab, Tooltip, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditPrintDrawer from "../drawers/EditPrintDrawer";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import LoadingDialog from "../LoadingDialog";
import useAPIToken from "../../hooks/use-api-token";
import usePrinters from "../../hooks/use-printers";
import AddIcon from "@mui/icons-material/Add";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}prints/`;

const PrintsGrid = (
  props: React.PropsWithoutRef<{
    prints: IPrint[];
    allowEdit?: boolean;
    allowDelete?: boolean;
    allowAdd?: boolean;
    onInsertSuccess?: (newPrint: IPrint) => void;
    onEditSuccess?: (editedPrint: IPrint) => void;
    onDeleteSuccess?: (deletedPrint: IPrint) => void;
    includePrinterName?: boolean;
  }>,
) => {
  const [showEditPrintDrawer, setShowEditPrintDrawer] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<IPrint | null>(null);
  const [showDeletePrintDialog, setShowDeletePrintDialog] = useState(false);
  const [printToDelete, setPrintToDelete] = useState<IPrint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { printers } = usePrinters();

  const apiToken = useAPIToken();

  const columns: GridColDef<IPrint>[] = [
    {
      field: "SnapshotUrl",
      headerName: "Snapshot",
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.imageUrl) {
          return (
            <ImageHoverZoom
              imagePath={params.row.imageUrl}
              width={50}
            ></ImageHoverZoom>
          );
        }
        if (params.row.SnapshotUrl) {
          return (
            <ImageHoverZoom
              imagePath={params.row.SnapshotUrl}
              width={50}
            ></ImageHoverZoom>
          );
        }
        return <></>;
      },
    },
    { field: "PrintStatus", headerName: "Status" },
    { field: "FileName", headerName: "File Name", flex: 1 },
    {
      field: "DurationSec",
      headerName: "Duration",
      renderCell: (params) => {
        const duration = params.row.DurationSec || 0;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration - hours * 3600) / 60);
        const seconds = duration - hours * 3600 - minutes * 60;
        let timeString = hours ? hours.toString() + "h " : "";
        timeString += minutes ? minutes.toString() + "m " : "";
        timeString += seconds ? seconds.toString() + "s " : "";
        return timeString;
      },
    },
    { field: "amountUsed", headerName: "Amount Used" },
    {
      field: "insertedAt",
      headerName: "Added At",
      valueFormatter: (field) =>
        moment(Number(field.value)).format("YYYY-MM-DD"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 150,
      getActions: (p) => {
        const actions = [];
        if (props.allowEdit) {
          actions.push(
            <Tooltip title="Edit" enterDelay={1000}>
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => {
                  setSelectedPrint(p.row);
                  setShowEditPrintDrawer(true);
                }}
              />
            </Tooltip>,
          );
        }
        if (props.allowDelete) {
          actions.push(
            <Tooltip title="Delete" enterDelay={1000}>
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                  setPrintToDelete(p.row);
                  setShowDeletePrintDialog(true);
                }}
                color="inherit"
              />
            </Tooltip>,
          );
        }
        return actions;
      },
    },
  ];

  if (props.includePrinterName) {
    columns.splice(2, 0, {
      field: "PrinterName",
      headerName: "Printer",
      renderCell: (params) => {
        const printer = printers?.find((p) => p.id === params.row.printerId);
        return printer ? `${printer.brand} - ${printer.name}` : "";
      },
      width: 175,
    });
  }

  const deletePrint = async (print: IPrint) => {
    setIsLoading(true);
    setShowDeletePrintDialog(false);

    const response = await fetch(apiURL + print.PrintId, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    if (response.ok) {
      props.onDeleteSuccess && props.onDeleteSuccess(print);
    } else {
      console.error("Failed to delete print", response);
    }

    setPrintToDelete(null);
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading}></LoadingDialog>
      <Grid xs={12}>
        {props.prints && (
          <>
            <DataGrid
              rows={props.prints}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: "insertedAt", sort: "desc" }],
                },
              }}
              pageSizeOptions={[10, 50, 100]}
              sx={{ marginTop: 2, marginLeft: 3 }}
              autoHeight
              getRowId={(row) => row.insertedAt}
            />
            {selectedPrint && props.allowEdit && (
              <EditPrintDrawer
                open={showEditPrintDrawer}
                printerId={selectedPrint.printerId}
                print={selectedPrint}
                onClose={(action, updatedPrint) => {
                  if (action && action === "update" && updatedPrint) {
                    props.onEditSuccess && props.onEditSuccess(updatedPrint);
                  }
                  if (action && action === "insert" && updatedPrint) {
                    props.onInsertSuccess &&
                      props.onInsertSuccess(updatedPrint);
                  }
                  setShowEditPrintDrawer(false);
                }}
              ></EditPrintDrawer>
            )}
            <ConfirmationDialog
              open={showDeletePrintDialog}
              onCancel={() => {
                setShowDeletePrintDialog(false);
                setPrintToDelete(null);
              }}
              onConfirm={() => {
                deletePrint(printToDelete!);
              }}
            >
              Are you sure you want to delete this print? This action cannot be
              undone.
            </ConfirmationDialog>
          </>
        )}
        {props.allowAdd && (
          <Fab
            size="medium"
            sx={{ position: "absolute", bottom: 32, right: 32 }}
            onClick={() => {
              setSelectedPrint(getDefaultPrint());
              setShowEditPrintDrawer(true);
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Grid>
    </>
  );
};

export default PrintsGrid;
