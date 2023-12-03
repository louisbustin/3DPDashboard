import { useState } from "react";
import LoadingDialog from "../components/LoadingDialog";
import MessageBanner from "../components/MessageBanner";

//const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const PrintPage = () => {
  //const { data, mutate, isLoading, isValidating } = useSWR<IPrinter[]>(apiURL);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      <LoadingDialog open={false}></LoadingDialog>
    </>
  );
};

export default PrintPage;
