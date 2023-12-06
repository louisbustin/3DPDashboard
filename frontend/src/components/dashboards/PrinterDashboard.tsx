import { Grid, Stack, Tooltip } from "@mui/material";
import SummaryCard from "../SummaryCard";
import printImage from "../../images/3dprint.png";
import { useParams } from "react-router-dom";
import IPrinter from "../../models/IPrinter";
import { useEffect, useState } from "react";
import ImageWithText from "../formelements/ImageWithText";
import PieChartCard from "../PieChartCard";
import { DefaultizedPieValueType, PieItemIdentifier } from "@mui/x-charts";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IPrint, { getDefaultPrint } from "../../models/IPrint";
import moment from "moment";
import EditPrintDrawer from "../drawers/EditPrintDrawer";
import ConfirmationDialog from "../ConfirmationDialog";
import MessageBanner from "../MessageBanner";
import useAPIToken from "../../hooks/use-api-token";
import LoadingDialog from "../LoadingDialog";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import useFetch from "../../hooks/use-fetch";
import ImageHoverZoom from "../ImageHoverZoom";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers/`;
type IPrinterDashboardData = {
  successCount: number;
  failureCount: number;
  totalCount: number;
  pendingCount: number;
};

const PrinterDashboard = () => {
  const { printerid } = useParams();
  const { data, isLoading, mutate } = useFetch<IPrinter>(apiURL + printerid);
  const [dashboardData, setDashboardData] = useState<IPrinterDashboardData>();
  const [printFilter, setPrintFilter] = useState("");
  const [showEditPrintDrawer, setShowEditPrintDrawer] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<IPrint>(getDefaultPrint());
  const [showDeletePrintDialog, setShowDeletePrintDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useAPIToken();
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [minDateFilter, setMinDateFilter] = useState<number>(0);
  const [maxDateFilter, setMaxDateFilter] = useState<number>(9999999999999);

  useEffect(() => {
    if (data && !isLoading) {
      const printData: IPrinterDashboardData = {
        successCount: 0,
        failureCount: 0,
        totalCount: 0,
        pendingCount: 0,
      };
      data.prints.forEach((print) => {
        printData.totalCount++;
        switch (print.status) {
          case "Complete":
            printData.successCount++;
            break;
          case "Failed":
            printData.failureCount++;
            break;
          case "Pending":
            printData.pendingCount++;
            break;
        }
      });
      setDashboardData(printData);
    }
  }, [data, isLoading]);

  const onPieChartClick = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    itemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType
  ) => {
    if (printFilter !== item.label) {
      setPrintFilter(item.label || "");
    } else {
      setPrintFilter("");
    }
  };

  const deletePrint = async () => {
    //remove a print from the printer prints array and POST back to save
    if (data) {
      setShowLoadingDialog(true);
      setShowDeletePrintDialog(false);
      const printerToSave = { ...data };
      printerToSave.prints = printerToSave.prints.filter(
        (print) => print.id !== selectedPrint.id
      );
      const response = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(printerToSave),
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (response && response.ok) {
        setSuccessMessage("Print deleted successfully");
        mutate();
        setTimeout(() => setSuccessMessage(""), 5000);
        setShowLoadingDialog(false);
      } else {
        setErrorMessage("Error deleting print");
      }
    }
  };
  const columns: GridColDef<IPrint>[] = [
    {
      field: "SnapshotUrl",
      headerName: "Snapshot",
      renderCell: (params) =>
        params.row.SnapshotUrl && (
          <ImageHoverZoom
            imagePath={params.row.SnapshotUrl}
            width={50}
          ></ImageHoverZoom>
        ),
    },
    { field: "status", headerName: "Status", flex: 1 },
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
        return [
          <Tooltip title="Edit" enterDelay={1000}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => {
                setSelectedPrint({ ...p.row });
                setShowEditPrintDrawer(true);
              }}
            />
          </Tooltip>,
          <Tooltip title="Delete" enterDelay={1000}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                setSelectedPrint({ ...p.row });
                setShowDeletePrintDialog(true);
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
      <h2>Dashboard for {data?.name}</h2>
      <LoadingDialog open={showLoadingDialog || isLoading}></LoadingDialog>
      <MessageBanner
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => {
          setSuccessMessage("");
          setErrorMessage("");
        }}
      ></MessageBanner>
      <Grid container spacing={3} justifyContent="center">
        {dashboardData && (
          <>
            <Grid item xs={12} md={4}>
              <PieChartCard
                onClick={onPieChartClick}
                slotProps={{ legend: { hidden: true } }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: dashboardData.successCount,
                        label: "Complete",
                        color: "green",
                      },
                      {
                        id: 1,
                        value: dashboardData.failureCount,
                        label: "Failed",
                        color: "red",
                      },
                      {
                        id: 2,
                        value: dashboardData.pendingCount,
                        label: "Pending",
                        color: "yellow",
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                title="Success/Failure"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryCard
                title="Successful Prints"
                iconElement={
                  <ImageWithText
                    src={printImage}
                    text={dashboardData.successCount.toString()}
                    width={64}
                    height={64}
                  />
                }
              ></SummaryCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <SummaryCard
                title="Failed Prints"
                iconElement={
                  <ImageWithText
                    src={printImage}
                    text={dashboardData.failureCount.toString()}
                    width={64}
                    height={64}
                  />
                }
              ></SummaryCard>
            </Grid>
          </>
        )}
        {data && (
          <>
            <Grid item xs={12}>
              <Stack direction="row" display="flex" alignItems="center">
                From
                <DatePicker
                  sx={{ marginLeft: 2, marginRight: 2 }}
                  onChange={(v: Dayjs | null) =>
                    setMinDateFilter(v ? v.unix() * 1000 : 0)
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                />
                to{" "}
                <DatePicker
                  sx={{ marginLeft: 2 }}
                  onChange={(v: Dayjs | null) =>
                    setMaxDateFilter(v ? v.unix() * 1000 : 9999999999999)
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                />
              </Stack>
            </Grid>
            <DataGrid
              rows={data.prints.filter((p) => {
                return (
                  (printFilter === "" || p.status === printFilter) &&
                  minDateFilter <= p.insertedAt &&
                  p.insertedAt <= maxDateFilter
                );
              })}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 50, 100]}
              sx={{ marginTop: 2, marginLeft: 3 }}
            />
          </>
        )}
      </Grid>
      {data && (
        <EditPrintDrawer
          open={showEditPrintDrawer}
          printerId={data?.id}
          print={selectedPrint}
          onClose={(didUpdate) => {
            if (didUpdate) mutate();
            setShowEditPrintDrawer(false);
          }}
        ></EditPrintDrawer>
      )}
      <ConfirmationDialog
        open={showDeletePrintDialog}
        onCancel={() => setShowDeletePrintDialog(false)}
        onConfirm={() => deletePrint()}
      >
        Are you sure you want to delete this print? This action cannot be
        undone.
      </ConfirmationDialog>
    </>
  );
};

export default PrinterDashboard;
