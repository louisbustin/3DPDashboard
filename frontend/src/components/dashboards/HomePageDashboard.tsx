import { Grid } from "@mui/material";
import SummaryCard from "../SummaryCard";
import filamentImage from "../../images/filamentspools.png";
import printerImage from "../../images/3dprinter.png";
import printImage from "../../images/3dprint.png";
import IDashboard from "../../models/IDashboard";
import LoadingDialog from "../LoadingDialog";
import useFetch from "../../hooks/use-fetch";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}dashboard`;

const HomePageDashboard = () => {
  const { data, isLoading } = useFetch<IDashboard>(apiURL);
  return (
    <>
      <LoadingDialog open={isLoading} />
      <h2>Welcome to your dashboard!</h2>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Current spools"
            total={data?.filamentCount || 0}
            iconLocation={filamentImage}
            link="/filament"
          ></SummaryCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Printers"
            total={data?.printerCount || 0}
            iconLocation={printerImage}
            link="/printers"
          ></SummaryCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Active Prints"
            total={data?.printCount || 0}
            iconLocation={printImage}
          ></SummaryCard>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePageDashboard;
