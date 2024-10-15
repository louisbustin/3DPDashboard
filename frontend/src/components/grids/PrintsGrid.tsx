import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import IPrint from "../../models/IPrint";
import ImageHoverZoom from "../ImageHoverZoom";
import moment from "moment";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditPrintDrawer from "../drawers/EditPrintDrawer";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import LoadingDialog from "../LoadingDialog";
import useAPIToken from "../../hooks/use-api-token";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}prints/`;

const PrintsGrid = (
  props: React.PropsWithoutRef<{
    prints: IPrint[];
    allowEdit?: boolean;
    allowDelete?: boolean;
    onEditSuccess?: (editedPrint: IPrint) => void;
    onDeleteSuccess?: (deletedPrint: IPrint) => void;
  }>
) => {
  const [showEditPrintDrawer, setShowEditPrintDrawer] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<IPrint | null>(null);
  const [showDeletePrintDialog, setShowDeletePrintDialog] = useState(false);
  const [printToDelete, setPrintToDelete] = useState<IPrint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    { field: "PrintStatus", headerName: "Status", flex: 1 },
    { field: "FileName", headerName: "File Name", flex: 1 },
    { field: "DurationSec", headerName: "Duration (secs)", flex: 1 },
    { field: "amountUsed", headerName: "Amount Used", flex: 1 },
    {
      field: "insertedAt",
      headerName: "Added At",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.insertedAt).format("YYYY-MM-DD"),
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
            </Tooltip>
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
            </Tooltip>
          );
        }
        return actions;
      },
    },
  ];

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
              onClose={(didUpdate, updatedPrint) => {
                if (didUpdate && updatedPrint) {
                  props.onEditSuccess && props.onEditSuccess(updatedPrint);
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
    </>
  );
};

export default PrintsGrid;
