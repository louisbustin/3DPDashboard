import { PropsWithChildren, useEffect, useState } from "react";
import EditDrawer from "./EditDrawer";
import { Stack } from "@mui/material";
import IPrinter from "../../models/IPrinter";
import useBearerToken from "../../hooks/use-bearer-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const EditPrinterDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    printerId?: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [printer, setPrinter] = useState<IPrinter>({
    id: props.printerId || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useBearerToken();

  useEffect(() => {
    const getPrinter = async () => {
      setIsLoading(true);
      if (props.printerId) {
        const response = await fetch(apiURL + "/" + props.printerId, {
          method: "GET",
          headers: { Authorization: `Bearer ${bearerToken}` },
        });
        if (response.ok) {
          setPrinter(await response.json());
        }
      } else {
        setPrinter({
          id: props.printerId || "",
        });
      }
      setIsLoading(false);
      // Click on the text field when done loading
      document.getElementById("brand")?.focus();
    };
    getPrinter();
  }, [props.printerId, bearerToken]);

  const onChangeBrand = (brand: string) => {
    setPrinter((f) => {
      return { ...f, brand };
    });
  };
  const onChangeName = (name: string) => {
    setPrinter((f) => {
      return { ...f, name };
    });
  };
  const onChangeType = (type: string) => {
    setPrinter((f) => {
      return { ...f, type };
    });
  };

  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved printers when we close the dialog
    setPrinter({
      id: props.printerId || "",
    });
  };
  const savePrinter = async () => {
    setIsLoading(true);
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(printer),
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      setSuccessMessage("Printer created successfully.");
      handleClose(true);
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage(`Creation failed with message: ${response.statusText}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading} />
      <MessageBanner
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClose={() => {
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />
      <EditDrawer
        open={props.open}
        onClose={() => handleClose(false)}
        onSave={savePrinter}
        hideDeleteButton={true}
      >
        <Stack spacing={2}>
          <h2>{props.printerId ? "Edit " : "New "}Printer</h2>
          <ShrunkTextField
            required
            id="brand"
            label="Brand"
            value={printer.brand}
            onChange={(e) => onChangeBrand(e.target.value)}
          />
          <ShrunkTextField
            id="name"
            label="Name"
            value={printer.name}
            onChange={(e) => onChangeName(e.target.value)}
          />
          <ShrunkTextField
            id="type"
            label="Type"
            value={printer.type}
            onChange={(e) => onChangeType(e.target.value)}
          />
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditPrinterDrawer;
