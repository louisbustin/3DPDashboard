import { PropsWithChildren, useState } from "react";
import EditDrawer from "./EditDrawer";
import { MenuItem, Stack } from "@mui/material";
import useBearerToken from "../../hooks/use-bearer-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";
import IPrint, { Status, getDefaultPrint } from "../../models/IPrint";
import useSWR from "swr";
import IPrinter from "../../models/IPrinter";
import StyledSelect from "../formelements/StyledSelect";
import IFilament from "../../models/IFilament";
import { v4 as uuidv4 } from "uuid";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;
const printApiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;

const AddPrintDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    filamentId: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [print, setPrint] = useState<IPrint>(getDefaultPrint());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useBearerToken();
  const { data: printers, isLoading: printersLoading } =
    useSWR<IPrinter[]>(printApiURL);

  const onChangeAmount = (amount: string) => {
    setPrint((f) => {
      return { ...f, amountUsed: Number(amount) };
    });
  };

  const onChangePrinter = (printerId: string) => {
    setPrint((f) => {
      return { ...f, printerId };
    });
  };
  const onChangeStatus = (status: Status) => {
    setPrint((f) => {
      return { ...f, status };
    });
  };

  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved filaments when we close the dialog
    setPrint(getDefaultPrint());
  };

  const savePrint = async () => {
    setIsLoading(true);

    //pull updated filament first
    const filamentURL = apiURL + "/" + props.filamentId;

    const filamentGetResponse = await fetch(filamentURL, {
      method: "GET",
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (filamentGetResponse.ok) {
      print.id = uuidv4();
      const filament = (await filamentGetResponse.json()) as IFilament;
      if (filament.prints) {
        filament.prints.push(print);
      } else {
        filament.prints = [print];
      }

      console.log(filament);

      const response = await fetch(apiURL, {
        method: "POST",
        body: JSON.stringify(filament),
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (response.ok) {
        setSuccessMessage("Print created successfully.");
        handleClose(true);
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage(`Creation failed with message: ${response.statusText}`);
      }
    } else {
      setErrorMessage("Creation failed - cannot get current filament");
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading || printersLoading} />
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
        onSave={savePrint}
        hideDeleteButton={true}
      >
        <Stack spacing={2}>
          <h2>New Print</h2>
          <ShrunkTextField
            required
            id="amount"
            label="Amount Used"
            value={print.amountUsed}
            onChange={(e) => onChangeAmount(e.target.value)}
          />
          <StyledSelect
            id="printer-select"
            label="Printer"
            value={print.printerId}
            onChange={(e) => onChangePrinter(e.target.value as string)}
          >
            {!printersLoading &&
              printers?.map((p) => {
                return (
                  <MenuItem key={p.id} value={p.id}>
                    {p.brand} - {p.name} {p.type}
                  </MenuItem>
                );
              })}
          </StyledSelect>
          <StyledSelect
            id="print-status"
            label="Status"
            value={print.status}
            onChange={(e) => onChangeStatus(e.target.value as Status)}
          >
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
          </StyledSelect>
        </Stack>
      </EditDrawer>
    </>
  );
};

export default AddPrintDrawer;
