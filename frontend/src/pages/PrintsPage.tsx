import { useState } from "react";
import LoadingDialog from "../components/LoadingDialog";
import MessageBanner from "../components/MessageBanner";
import PrintsGrid from "../components/grids/PrintsGrid";
import usePrints from "../hooks/use-prints";
import DateFilter from "../components/DateFilter";
import dayjs from "dayjs";

const PrintsPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [minMaxDate, setMinMaxDate] = useState({
    minDate: dayjs().subtract(1, "week").startOf("day").unix() * 1000,
    maxDate: dayjs().endOf("day").unix() * 1000,
  });

  const { prints, isLoading, refresh } = usePrints({
    startDate: minMaxDate.minDate,
    endDate: minMaxDate.maxDate,
  });

  return (
    <>
      <MessageBanner
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => {
          setSuccessMessage("");
          setErrorMessage("");
        }}
      ></MessageBanner>
      <h2>Prints</h2>
      {prints && (
        <>
          <DateFilter
            onDatesChange={(min, max) => {
              setMinMaxDate({ minDate: min, maxDate: max });
            }}
            minDate={minMaxDate.minDate}
            maxDate={minMaxDate.maxDate}
          ></DateFilter>
          <PrintsGrid
            prints={prints}
            onInsertSuccess={() => {
              refresh();
            }}
            onEditSuccess={() => refresh()}
            onDeleteSuccess={() => refresh()}
            allowDelete={true}
            allowEdit={true}
            allowAdd={true}
            includePrinterName={true}
          ></PrintsGrid>
        </>
      )}
      <LoadingDialog open={isLoading}></LoadingDialog>
    </>
  );
};

export default PrintsPage;
