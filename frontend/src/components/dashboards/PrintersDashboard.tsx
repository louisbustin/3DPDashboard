import { Grid } from "@mui/material";
import SummaryCard from "../SummaryCard";
import printerImage from "../../images/3dprinter.png";
import IPrinter from "../../models/IPrinter";
import ImageWithText from "../formelements/ImageWithText";
import LoadingDialog from "../LoadingDialog";
import useFetch from "../../hooks/use-fetch";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const PrintersDashboard = () => {
  const { data, isLoading } = useFetch<IPrinter[]>(apiURL);
  return (
    <>
      <LoadingDialog open={isLoading} />
      <h2>Printers Dashboard</h2>
      <Grid container spacing={3} justifyContent="center">
        {!isLoading &&
          data &&
          data.map((p, index) => {
            return (
              <Grid item xs={12} md={4} key={p.id}>
                <SummaryCard
                  title={p.name || ""}
                  iconElement={
                    <ImageWithText
                      src={printerImage}
                      text={(index + 1).toString()}
                      width={64}
                      height={64}
                    />
                  }
                  link={`/dashboard/printers/${p.id}`}
                ></SummaryCard>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default PrintersDashboard;
