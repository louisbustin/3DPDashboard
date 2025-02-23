import Grid from "@mui/material/Grid2";
import SummaryCard from "../SummaryCard";
import printerImage from "../../images/3dprinter.png";
import IPrinter from "../../models/IPrinter";
import ImageWithText from "../formelements/ImageWithText";
import {LoadingDialog} from "@eforge/eforge-common";
import useFetch from "../../hooks/use-fetch";
import { isArray } from "lodash";
import SaveButton from "../buttons/SaveButton";
import { useNavigate } from "react-router-dom";

const apiURL = `${import.meta.env.VITE_BASE_URL}printers`;

const PrintersDashboard = () => {
  const { data, isLoading } = useFetch<IPrinter[]>(apiURL);
  const navigate = useNavigate();
  return (
    <>
      <LoadingDialog open={isLoading} />
      <h2>Printers Dashboard</h2>
      <Grid container justifyContent={"right"} marginBottom={2}>
        <SaveButton onClick={() => navigate("/printers")}>
          Manage Printers
        </SaveButton>
      </Grid>
      <Grid container spacing={3} justifyContent="center">
        {!isLoading &&
          data &&
          isArray(data) &&
          data.map((p, index) => {
            return (
              <Grid size={{xs: 12, md: 4}} key={p.id}>
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
