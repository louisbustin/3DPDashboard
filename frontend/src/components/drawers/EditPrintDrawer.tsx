import {PropsWithChildren, useContext, useEffect, useState} from "react";
import EditDrawer from "./EditDrawer";
import {MenuItem, Stack} from "@mui/material";
import useAPIToken from "../../hooks/use-api-token";
import {LoadingDialog, MessageBannerContext} from "@eforge/eforge-common";
import ShrunkTextField from "../formelements/ShrunkTextField";
import IPrint, {Status, getDefaultPrint} from "../../models/IPrint";
import StyledSelect from "../formelements/StyledSelect";
import FilamentSelection from "../formelements/FilamentSelection";
import PrinterSelection from "../formelements/PrinterSelection";

const printApiURL = `${import.meta.env.VITE_BASE_URL}prints`;

const EditPrintDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (action?: "update" | "insert" | "none", print?: IPrint) => void;
    printerId: string;
    print?: IPrint;
  }>,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [print, setPrint] = useState<IPrint>(getDefaultPrint());
  const msgContext = useContext(MessageBannerContext);

  const bearerToken = useAPIToken();

  useEffect(() => {
    if (props.print) {
      setPrint({...props.print});
    }
  }, [props.print]);

  const onChangeAmount = (amount: string) => {
    setPrint((f) => {
      return {...f, amountUsed: Number(amount)};
    });
  };

  const onChangeFilament = (filamentId: string) => {
    setPrint((f) => {
      return {...f, filamentId};
    });
  };

  const onChangePrinter = (printerId: string) => {
    setPrint((f) => {
      return {...f, printerId};
    });
  };

  const onChangeStatus = (status: Status) => {
    setPrint((f) => {
      return {...f, PrintStatus: status};
    });
  };
  const onChangeDuration = (durationSec: number) => {
    setPrint((f) => {
      return {...f, DurationSec: durationSec};
    });
  };
  const handleClose = (updateOccurred: boolean) => {
    const action = print.PrintId ? "update" : "insert";
    if (props.onClose)
      props.onClose(
        updateOccurred ? action : "none",
        updateOccurred ? print : undefined,
      );
    //clear out any saved filaments when we close the dialog
    setPrint(getDefaultPrint());
  };

  const savePrint = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${printApiURL}/${print.PrintId ? print.PrintId : ""}`,
      {
        method: "POST",
        body: JSON.stringify(print),
        headers: {Authorization: `Bearer ${bearerToken}`},
      },
    );
    if (response.ok) {
      msgContext.setSuccessMessage(`Print ${print.PrintId ? "updated" : "created"} successfully.`)
      handleClose(true);
    } else {
      msgContext.setErrorMessage(`Update failed with message: ${response.statusText}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog open={isLoading}/>
      <EditDrawer
        open={props.open}
        onClose={() => handleClose(false)}
        onSave={savePrint}
        hideDeleteButton={true}
      >
        <Stack spacing={2}>
          <h2>{props.print?.PrintId ? "Edit" : "New"} Print</h2>
          <StyledSelect
            id="print-status"
            label="Status"
            value={print.PrintStatus}
            onChange={(e) => onChangeStatus(e.target.value as Status)}
          >
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </StyledSelect>
          <PrinterSelection
            required={true}
            printerId={print.printerId}
            onChange={onChangePrinter}
          />
          <ShrunkTextField
            required
            id="filename-input"
            label="File Name"
            value={print.FileName}
            onChange={(e) =>
              setPrint((print) => {
                return {...print, FileName: e.target.value};
              })
            }
          />
          <ShrunkTextField
            id="duration"
            label="Duration (secs)"
            value={print.DurationSec || 0}
            onChange={(e) => onChangeDuration(Number(e.target.value))}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <ShrunkTextField
            required
            id="amount"
            label="Amount Used"
            value={print.amountUsed}
            onChange={(e) => onChangeAmount(e.target.value)}
            type="number"
            InputProps={{inputProps: {min: 0}}}
          />
          <FilamentSelection
            onChange={onChangeFilament}
            filamentId={print.filamentId || ""}
          ></FilamentSelection>
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditPrintDrawer;
