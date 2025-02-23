import Grid from "@mui/material/Grid2";
import SummaryCard from "../SummaryCard";
import filamentImage from "../../images/filamentspools.png";
import printerImage from "../../images/3dprinter.png";
import printImage from "../../images/3dprint.png";
import IDashboard from "../../models/IDashboard";
import {LoadingDialog} from "@eforge/eforge-common";
import useFetch from "../../hooks/use-fetch";

const apiURL = `${import.meta.env.VITE_BASE_URL}dashboard`;

const HomePageDashboard = () => {
  const {data, isLoading} = useFetch<IDashboard>(apiURL);
  return (
    <>
      <LoadingDialog open={isLoading}/>
      <h2>Welcome to your dashboard!</h2>
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{xs: 12, md: 4}}>
          <SummaryCard
            title="Current spools"
            total={data?.filamentCount || 0}
            iconLocation={filamentImage}
            link="/filament"
          ></SummaryCard>
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <SummaryCard
            title="Printers"
            total={data?.printerCount || 0}
            iconLocation={printerImage}
            link="/dashboard/printers"
          ></SummaryCard>
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <SummaryCard
            title="Recent Prints"
            total={data?.recentPrintCount || 0}
            iconLocation={printImage}
            link="/prints"
          ></SummaryCard>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePageDashboard;
