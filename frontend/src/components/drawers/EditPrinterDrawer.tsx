import {PropsWithChildren, useContext, useEffect, useState} from "react";
import EditDrawer from "./EditDrawer";
import {Stack} from "@mui/material";
import IPrinter, {getDefaultPrinter} from "../../models/IPrinter";
import useAPIToken from "../../hooks/use-api-token";
import {LoadingDialog, MessageBannerContext} from "@eforge/eforge-common";
import ShrunkTextField from "../formelements/ShrunkTextField";

const apiURL = `${import.meta.env.VITE_BASE_URL}printers`;

const EditPrinterDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    printerId?: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [printer, setPrinter] = useState<IPrinter>(getDefaultPrinter());
  const msgCtx = useContext(MessageBannerContext);
  const bearerToken = useAPIToken();

  useEffect(() => {
    const getPrinter = async () => {
      setIsLoading(true);
      if (props.printerId) {
        const response = await fetch(apiURL + "/" + props.printerId, {
          method: "GET",
          headers: {Authorization: `Bearer ${bearerToken}`},
        });
        if (response.ok) {
          setPrinter(await response.json());
        }
      } else {
        setPrinter(getDefaultPrinter());
      }
      setIsLoading(false);
      // Click on the text field when done loading
      document.getElementById("brand")?.focus();
    };
    getPrinter().then();
  }, [props.printerId, bearerToken]);

  const onChangeBrand = (brand: string) => {
    setPrinter((f) => {
      return {...f, brand};
    });
  };
  const onChangeName = (name: string) => {
    setPrinter((f) => {
      return {...f, name};
    });
  };
  const onChangeType = (type: string) => {
    setPrinter((f) => {
      return {...f, type};
    });
  };

  const onChangeOctoId = (octoId: string) => {
    setPrinter((f) => {
      return {...f, octoEverywhereId: octoId};
    });
  };
  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved printers when we close the dialog
    setPrinter(getDefaultPrinter());
  };
  const savePrinter = async () => {
    setIsLoading(true);
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(printer),
      headers: {Authorization: `Bearer ${bearerToken}`},
    });
    if (response.ok) {
      msgCtx.setSuccessMessage("Printer created successfully.");
      handleClose(true);
    } else {
      msgCtx.setErrorMessage(`Creation failed with message: ${response.statusText}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading}/>
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
          <ShrunkTextField
            id="octoid"
            label="Octoeverywhere Printer Id"
            value={printer.octoEverywhereId}
            onChange={(e) => onChangeOctoId(e.target.value)}
          />
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditPrinterDrawer;
