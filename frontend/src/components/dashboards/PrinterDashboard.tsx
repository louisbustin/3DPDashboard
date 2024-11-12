import {Card, Chip, Grid, Stack} from "@mui/material";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import PieChartCard from "../PieChartCard";
import {DefaultizedPieValueType, PieItemIdentifier} from "@mui/x-charts";
import IPrint, {Status} from "../../models/IPrint";
import MessageBanner from "../MessageBanner";
import useAPIToken from "../../hooks/use-api-token";
import LoadingDialog from "../LoadingDialog";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import BarChartCard from "../BarChartCard";
import usePrinters from "../../hooks/use-printers";
import {IPrintLastEvaluatedKey} from "../../models/IPrintResponse";
import PrintsGrid from "../grids/PrintsGrid";
import BaseButton from "../buttons/BaseButton";
import CollapseArea from "../CollapseArea";
import useFilament from "../../hooks/use-filament";

const MAX_DATE = 9999999999999;
const MIN_DATE = 0;

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers/`;

type IFilamentBrandSummary = {
  brand: string;
  statusCount: {
    Active: number;
    Complete: number;
    Failed: number;
    Pending: number;
    Cancelled: number;
  }
}

type IPrinterDashboardData = {
  successCount: number;
  failureCount: number;
  totalCount: number;
  pendingCount: number;
  printsByFilament: IFilamentBrandSummary[];
};

const PrinterDashboard = () => {
  const EXPAND_GRAPHS_KEY = "expand-graphs";
  const {printerid} = useParams();
  const {printers, isLoading} = usePrinters();
  const data = printers?.filter((p) => p.id === printerid)[0];
  const [dashboardData, setDashboardData] = useState<IPrinterDashboardData>();
  const [printFilter, setPrintFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bearerToken = useAPIToken();
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [minDateFilter, setMinDateFilter] = useState<number>(MIN_DATE);
  const [maxDateFilter, setMaxDateFilter] = useState<number>(MAX_DATE);
  const [prints, setPrints] = useState<IPrint[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<
    IPrintLastEvaluatedKey | undefined
  >(undefined);
  const [pullNextPrints, setPullNextPrints] = useState(true);
  const {filament} = useFilament();

  useEffect(() => {
    const getPrintsByPrinter = async (printerId?: string) => {
      setShowLoadingDialog(true);
      let p;

      let response;
      response = await fetch(
        apiURL +
        printerId +
        "/prints" +
        (lastEvaluatedKey
          ? `?LastEvaluatedKey=${encodeURIComponent(
            JSON.stringify(lastEvaluatedKey),
          )}`
          : ""),
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        },
      );

      p = await response.json();

      if (p.data) {
        const accumulatedPrints = prints.concat(p.data);
        setPrints([...accumulatedPrints]);
        setPullNextPrints(false);
      }
      setLastEvaluatedKey(
        p.LastEvaluatedKey ? {...p.LastEvaluatedKey} : undefined,
      );
      setShowLoadingDialog(false);
    };

    if (bearerToken && pullNextPrints) {
      getPrintsByPrinter(printerid).then();
    }
  }, [bearerToken, printerid, lastEvaluatedKey, pullNextPrints, prints]);

  useEffect(() => {
    const addFilamentBrand = (brand: string, status: Status, brandSummary: IFilamentBrandSummary[]) => {
      const currentFilaByBrand = brandSummary.filter((p) => p.brand === brand);
      if (currentFilaByBrand.length === 1) {
        currentFilaByBrand[0].statusCount[status]++;
      } else {
        brandSummary.push({
          brand: brand,
          statusCount: {
            Active: status === "Active" ? 1 : 0,
            Complete: status === "Complete" ? 1 : 0,
            Failed: status === "Failed" ? 1 : 0,
            Pending: status === "Pending" ? 1 : 0,
            Cancelled: status === "Cancelled" ? 1 : 0,
          }
        });
      }
    }
    if (data && !isLoading) {
      const printData: IPrinterDashboardData = {
        successCount: 0,
        failureCount: 0,
        totalCount: 0,
        pendingCount: 0,
        printsByFilament: [],
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
        if (filament) {
          if (print.filamentId) {
            const fila = filament.filter((f) => f.id === print.filamentId);
            if (fila.length > 0) {
              fila.forEach((f) => {
                addFilamentBrand(f.brand, print.PrintStatus, printData.printsByFilament);
              });
            }
          } else {
            addFilamentBrand("No filament assigned", print.PrintStatus, printData.printsByFilament);
          }
        }
      });
      if (prints && filament) {
        setDashboardData(printData);
      }
    }
  }, [data, isLoading, prints, filament]);
  const onPieChartClick = (
    _event: React.MouseEvent<SVGPathElement, MouseEvent>,
    _itemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => {
    if (printFilter !== item.label) {
      setPrintFilter(item.label || "");
    } else {
      setPrintFilter("");
    }
  };

  const onDeletePrint = async (print: IPrint) => {
    setPrints((printArray) => {
      const newArray = printArray.filter(
        (p) => p.insertedAt !== print.insertedAt,
      );
      return [...newArray];
    });
    setSuccessMessage("Delete of print successful.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const onEditPrint = (print: IPrint) => {
    if (print) {
      setPrints((prints) => {
        for (let i = 0; i < prints.length; i++) {
          if (prints[i].insertedAt === print.insertedAt) {
            prints[i] = print;
            break;
          }
        }
        return [...prints];
      });
    }
  };

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
            <Grid item xs={12}>
              <CollapseArea
                initiallyExpanded={true}
                summary="Graphs"
                storageKey={EXPAND_GRAPHS_KEY}
              >
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  alignContent="center"
                >
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
                            highlightScope: {
                              faded: "global",
                              highlighted: "item",
                            },
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
                            position: {
                              vertical: "middle",
                              horizontal: "right",
                            },
                            padding: 0,
                          },
                        },
                      }}
                      title="Prints by Status"
                      height="90%"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {dashboardData && dashboardData.printsByFilament &&
                        <BarChartCard
                            barCharProps={{
                              height: 250,
                              yAxis: [
                                {
                                  data: [],

                                },
                              ],
                              xAxis: [
                                {
                                  scaleType: "band",
                                  data: dashboardData.printsByFilament.length > 0 ? dashboardData.printsByFilament.map((f) => f.brand) : [],
                                },
                              ],
                              series: [
                                {
                                  data: dashboardData.printsByFilament.length > 0 ? dashboardData.printsByFilament.map((f) => f.statusCount.Complete) : [0, 0, 0],
                                  label: "Complete",
                                  color: "green"
                                },
                                {
                                  data: dashboardData.printsByFilament.length > 0 ? dashboardData.printsByFilament.map((f) => f.statusCount.Failed) : [0, 0, 0],
                                  label: "Failed",
                                  color: "red"
                                },
                                {
                                  data: dashboardData.printsByFilament.length > 0 ? dashboardData.printsByFilament.map((f) => f.statusCount.Pending) : [0, 0, 0],
                                  label: "Pending",
                                  color: "yellow"
                                },
                              ],

                            }}
                            title="Prints by Filament"
                            height="90%"
                        ></BarChartCard>
                    }
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{p: 3}}>Prints by Filename coming</Card>
                  </Grid>
                </Grid>
              </CollapseArea>
            </Grid>
          </>
        )}
        {data && (
          <>
            <Grid item xs={6}>
              <Stack direction="row" display="flex" alignItems="center">
                From
                <DatePicker
                  sx={{marginLeft: 2, marginRight: 2}}
                  onChange={(v: Dayjs | null) =>
                    setMinDateFilter(v ? v.unix() * 1000 : MIN_DATE)
                  }
                  slotProps={{
                    field: {clearable: true},
                  }}
                  value={minDateFilter > MIN_DATE ? dayjs(minDateFilter) : null}
                />
                to
                <DatePicker
                  sx={{marginLeft: 2}}
                  onChange={
                    (v: Dayjs | null) =>
                      setMaxDateFilter(
                        v ? v.unix() * 1000 + 86399999 : MAX_DATE,
                      ) //Adding a day's (-1) amount of milliseconds to that the filters include that date
                  }
                  slotProps={{
                    field: {clearable: true},
                  }}
                  value={maxDateFilter < MAX_DATE ? dayjs(maxDateFilter) : null}
                />
              </Stack>
            </Grid>
            <Grid item xs={6} alignItems="center" justifyItems="center">
              {lastEvaluatedKey && (
                <BaseButton onClick={() => setPullNextPrints(true)}>
                  Get Next 50 prints
                </BaseButton>
              )}
              {minDateFilter > 0 && (
                <Chip
                  label={`Inserted after ${new Date(
                    minDateFilter,
                  ).toLocaleDateString()}`}
                  onDelete={() => setMinDateFilter(0)}
                  sx={{marginRight: 1}}
                />
              )}
              {maxDateFilter < MAX_DATE && (
                <Chip
                  label={`Inserted before ${new Date(
                    maxDateFilter,
                  ).toLocaleDateString()}`}
                  onDelete={() => setMaxDateFilter(MAX_DATE)}
                  sx={{marginRight: 1}}
                />
              )}
              {printFilter && (
                <Chip
                  label={"Status: " + printFilter}
                  onDelete={() => setPrintFilter("")}
                  sx={{marginRight: 1}}
                />
              )}
            </Grid>
            <PrintsGrid
              prints={prints.filter((p) => {
                return (
                  (printFilter === "" || p.PrintStatus === printFilter) &&
                  minDateFilter <= p.insertedAt &&
                  p.insertedAt <= maxDateFilter
                );
              })}
              allowDelete={true}
              allowEdit={true}
              onEditSuccess={onEditPrint}
              onDeleteSuccess={onDeletePrint}
            />
          </>
        )}
      </Grid>
    </>
  );
};

export default PrinterDashboard;
