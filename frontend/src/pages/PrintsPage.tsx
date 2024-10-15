import { useState } from "react";
import LoadingDialog from "../components/LoadingDialog";
import MessageBanner from "../components/MessageBanner";
import PrintsGrid from "../components/grids/PrintsGrid";
import usePrints from "../hooks/use-prints";
import DateFilter from "../components/DateFilter";

const oneWeek = 1000 * 60 * 60 * 24 * 7;

const PrintsPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [minMaxDate, setMinMaxDate] = useState({
    minDate: Date.now() - oneWeek,
    maxDate: Date.now(),
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
            initialMinDate={Date.now() - oneWeek}
            initialMaxDate={Date.now()}
          ></DateFilter>
          <PrintsGrid
            prints={prints}
            onEditSuccess={() => refresh()}
            onDeleteSuccess={() => refresh()}
            allowDelete={true}
            allowEdit={true}
          ></PrintsGrid>
        </>
      )}
      <LoadingDialog open={isLoading}></LoadingDialog>
    </>
  );
};

export default PrintsPage;
