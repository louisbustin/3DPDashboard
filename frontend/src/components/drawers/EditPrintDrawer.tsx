import { PropsWithChildren, useEffect, useState } from "react";
import EditDrawer from "./EditDrawer";
import { MenuItem, Stack } from "@mui/material";
import useAPIToken from "../../hooks/use-api-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";
import IPrint, { Status, getDefaultPrint } from "../../models/IPrint";
import StyledSelect from "../formelements/StyledSelect";
import FilamentSelection from "../formelements/FilamentSelection";

const printApiURL = `${process.env.REACT_APP_API_BASE_URL}prints`;

const EditPrintDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean, print?: IPrint) => void;
    printerId: string;
    print?: IPrint;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [print, setPrint] = useState<IPrint>(getDefaultPrint());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useAPIToken();

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
      return { ...f, PrintStatus: status };
    });
  };
  const onChangeDuration = (durationSec: number) => {
    setPrint((f) => {
      return { ...f, DurationSec: durationSec };
    });
  };
  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose)
      props.onClose(updateOccurred, updateOccurred ? print : undefined);
    //clear out any saved filaments when we close the dialog
    setPrint(getDefaultPrint());
  };

  const savePrint = async () => {
    setIsLoading(true);
    const response = await fetch(`${printApiURL}/${print.PrintId}`, {
      method: "POST",
      body: JSON.stringify(print),
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      setSuccessMessage("Print updated successfully.");
      handleClose(true);
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      setErrorMessage(`Update failed with message: ${response.statusText}`);
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
          <ShrunkTextField
            required
            id="amount"
            label="Amount Used"
            value={print.amountUsed}
            onChange={(e) => onChangeAmount(e.target.value)}
          />
          <FilamentSelection
            onChange={onChangeFilament}
            filamentId={print.filamentId || ""}
          ></FilamentSelection>
          <ShrunkTextField
            id="duration"
            label="Duration (secs)"
            value={print.DurationSec || 0}
            onChange={(e) => onChangeDuration(Number(e.target.value))}
            type="number"
          />
        </Stack>
      </EditDrawer>
    </>
  );
};

export default EditPrintDrawer;
