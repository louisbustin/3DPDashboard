import { PropsWithChildren, useEffect, useState } from "react";
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

const printerApiURL = `${process.env.REACT_APP_API_BASE_URL}printers`;
const filamentApiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const EditPrintDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    printerId: string;
    print?: IPrint;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [print, setPrint] = useState<IPrint>(getDefaultPrint());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useBearerToken();
  const { data: filament, isLoading: filamentLoading } =
    useSWR<IFilament[]>(filamentApiURL);

  useEffect(() => {
    if (props.print) {
      setPrint({ ...props.print });
    }
  }, [props.print]);

  const onChangeAmount = (amount: string) => {
    setPrint((f) => {
      return { ...f, amountUsed: Number(amount) };
    });
  };

  const onChangeFilament = (filamentId: string) => {
    setPrint((f) => {
      return { ...f, filamentId };
    });
  };
  const onChangeStatus = (status: Status) => {
    setPrint((f) => {
      return { ...f, status };
    });
  };
  const onChangeDuration = (durationSec: number) => {
    setPrint((f) => {
      return { ...f, DurationSecs: durationSec };
    });
  };
  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved filaments when we close the dialog
    setPrint(getDefaultPrint());
  };

  const savePrint = async () => {
    setIsLoading(true);

    //pull updated printer first
    const printerUrl = printerApiURL + "/" + props.printerId;

    const printerGetResponse = await fetch(printerUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (printerGetResponse.ok) {
      const p = (await printerGetResponse.json()) as IPrinter;
      if (p.prints) {
        const printIndex = p.prints.findIndex((pr) => {
          return pr.id === print.id;
        });
        if (printIndex >= 0) {
          p.prints[printIndex] = { ...p.prints[printIndex], ...print };
        } else {
          print.id = uuidv4();
          p.prints.push(print);
        }
      } else {
        p.prints = [print];
      }

      const response = await fetch(printerApiURL, {
        method: "POST",
        body: JSON.stringify(p),
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
      <LoadingDialog open={isLoading || filamentLoading} />
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
            label="Filament"
            value={print.filamentId}
            onChange={(e) => onChangeFilament(e.target.value as string)}
          >
            {!filamentLoading &&
              filament?.map((f) => {
                return (
                  <MenuItem key={f.id} value={f.id}>
                    {f.brand} - {f.name}
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
            <MenuItem value="Failed">Failed</MenuItem>
          </StyledSelect>
          <ShrunkTextField
            id="duration"
            label="Duration (secs)"
            value={print.DurationSec}
            onChange={(e) => onChangeDuration(Number(e.target.value))}
            type="number"
          />
          Progress?: number; EventType?: number; FileName?: string;
          QuickViewUrl?: string; Error?: string; PrinterId?: string;
          PrinterName?: string; ZOffsetMM?: string; SnapshotUrl?: string;
          TimeRemaningSec?: number;
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditPrintDrawer;
