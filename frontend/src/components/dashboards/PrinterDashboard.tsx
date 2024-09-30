import { Card, Chip, Grid, Stack, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import ImageHoverZoom from "../ImageHoverZoom";
import BarChartCard from "../BarChartCard";
import usePrinters from "../../hooks/use-printers";
import { IPrintLastEvaluatedKey } from "../../models/IPrintResponse";

const MAX_DATE = 9999999999999;
const MIN_DATE = 0;

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers/`;
type IPrinterDashboardData = {
  successCount: number;
  failureCount: number;
  totalCount: number;
  pendingCount: number;
};

const PrinterDashboard = () => {
  const { printerid } = useParams();
  const { printers, isLoading } = usePrinters();
  const data = printers?.filter((p) => p.id === printerid)[0];
  const [dashboardData, setDashboardData] = useState<IPrinterDashboardData>();
  const [printFilter, setPrintFilter] = useState("");
  const [showEditPrintDrawer, setShowEditPrintDrawer] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<IPrint>(getDefaultPrint());
  const [showDeletePrintDialog, setShowDeletePrintDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useAPIToken();
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [minDateFilter, setMinDateFilter] = useState<number>(MIN_DATE);
  const [maxDateFilter, setMaxDateFilter] = useState<number>(MAX_DATE);
  const [prints, setPrints] = useState<IPrint[]>([]);

  useEffect(() => {
    const getPrintsByPrinter = async (printerId?: string) => {
      setShowLoadingDialog(true);
      let evalKey: IPrintLastEvaluatedKey | undefined = undefined;
      let accumulatedPrints: IPrint[] = [];
      let p;

      let response;
      do {
        response = await fetch(
          apiURL +
            printerId +
            "/prints" +
            (evalKey
              ? `?LastEvaluatedKey=${encodeURIComponent(
                  JSON.stringify(evalKey)
                )}`
              : ""),
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        p = await response.json();

        if (p.data) {
          accumulatedPrints = accumulatedPrints.concat(p.data);
        }
        evalKey = { ...p.LastEvaluatedKey };
      } while (p.LastEvaluatedKey);
      setPrints([...accumulatedPrints]);
      setShowLoadingDialog(false);
    };

    if (bearerToken) {
      getPrintsByPrinter(printerid);
    }
  }, [bearerToken, printerid]);

  useEffect(() => {
    if (data && !isLoading) {
      const printData: IPrinterDashboardData = {
        successCount: 0,
        failureCount: 0,
        totalCount: 0,
        pendingCount: 0,
      };
      prints.forEach((print) => {
        printData.totalCount++;
        switch (print.PrintStatus) {
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
  }, [data, isLoading, prints]);
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
    //selected print should be the one we want deleted
    const response = await fetch(
      `${apiURL}${selectedPrint.printerId}/prints/${selectedPrint.insertedAt}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    if (response && response.ok) {
      setPrints((printArray) => {
        const newArray = printArray.filter(
          (p) => p.insertedAt !== selectedPrint.insertedAt
        );
        return [...newArray];
      });
      setShowDeletePrintDialog(false);
      setSuccessMessage("Delete of print successful.");
    } else {
      setErrorMessage("Delete was not successful.");
      setShowDeletePrintDialog(false);
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
      <Grid container spacing={3} justifyContent="center" alignContent="center">
        {dashboardData && (
          <>
            <Grid item xs={12} md={4}>
              <PieChartCard
                pieChartProps={{
                  height: 250,
                  onClick: onPieChartClick,
                  series: [
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
                  ],
                  slotProps: {
                    legend: {
                      direction: "column",
                      position: { vertical: "middle", horizontal: "right" },
                      padding: 0,
                    },
                  },
                }}
                title="Prints by Status"
                height="90%"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <BarChartCard
                barCharProps={{
                  height: 250,
                  yAxis: [
                    {
                      data: [{ label: "Complete" }, "Failed", "Pending"],
                    },
                  ],
                  xAxis: [
                    {
                      scaleType: "band",
                      data: [
                        "PolyMaker",
                        "PrintBed",
                        "No Filament Selected",
                        "All Others",
                      ],
                    },
                  ],
                  series: [
                    { data: [2, 3, 5, 3] },
                    { data: [1, 6, 3, 2] },
                    { data: [2, 5, 6, 2] },
                  ],
                }}
                title="Prints by Filament"
                height="90%"
              ></BarChartCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>Prints by Filename coming</Card>
            </Grid>
          </>
        )}
        {data && (
          <>
            <Grid item xs={6}>
              <Stack direction="row" display="flex" alignItems="center">
                From
                <DatePicker
                  sx={{ marginLeft: 2, marginRight: 2 }}
                  onChange={(v: Dayjs | null) =>
                    setMinDateFilter(v ? v.unix() * 1000 : MIN_DATE)
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                  value={minDateFilter > MIN_DATE ? dayjs(minDateFilter) : null}
                />
                to
                <DatePicker
                  sx={{ marginLeft: 2 }}
                  onChange={
                    (v: Dayjs | null) =>
                      setMaxDateFilter(
                        v ? v.unix() * 1000 + 86399999 : MAX_DATE
                      ) //Adding a day's (-1) amount of milliseconds to that the filters include that date
                  }
                  slotProps={{
                    field: { clearable: true },
                  }}
                  value={maxDateFilter < MAX_DATE ? dayjs(maxDateFilter) : null}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              {minDateFilter > 0 && (
                <Chip
                  label={`Inserted after ${new Date(
                    minDateFilter
                  ).toLocaleDateString()}`}
                  onDelete={() => setMinDateFilter(0)}
                  sx={{ marginRight: 1 }}
                />
              )}
              {maxDateFilter < MAX_DATE && (
                <Chip
                  label={`Inserted before ${new Date(
                    maxDateFilter
                  ).toLocaleDateString()}`}
                  onDelete={() => setMaxDateFilter(MAX_DATE)}
                  sx={{ marginRight: 1 }}
                />
              )}
              {printFilter && (
                <Chip
                  label={"Status: " + printFilter}
                  onDelete={() => setPrintFilter("")}
                  sx={{ marginRight: 1 }}
                />
              )}
            </Grid>
            <DataGrid
              rows={prints.filter((p) => {
                return (
                  (printFilter === "" || p.PrintStatus === printFilter) &&
                  minDateFilter <= p.insertedAt &&
                  p.insertedAt <= maxDateFilter
                );
              })}
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
          </>
        )}
      </Grid>
      {data && (
        <EditPrintDrawer
          open={showEditPrintDrawer}
          printerId={data?.id}
          print={selectedPrint}
          onClose={(didUpdate, updatedPrint) => {
            if (updatedPrint) {
              setPrints((prints) => {
                for (let i = 0; i < prints.length; i++) {
                  if (prints[i].insertedAt === updatedPrint.insertedAt) {
                    prints[i] = updatedPrint;
                    break;
                  }
                }
                return [...prints];
              });
            }
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
