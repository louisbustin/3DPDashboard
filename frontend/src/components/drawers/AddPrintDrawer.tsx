import { PropsWithChildren, useState } from "react";
import EditDrawer from "./EditDrawer";
import { MenuItem, Select, Stack } from "@mui/material";
import useBearerToken from "../../hooks/use-bearer-token";
import LoadingDialog from "../LoadingDialog";
import MessageBanner from "../MessageBanner";
import ShrunkTextField from "../formelements/ShrunkTextField";
import IPrint, { getDefaultPrint } from "../../models/IPrint";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}filament`;

const AddPrintDrawer = (
  props: PropsWithChildren<{
    open: boolean;
    onClose?: (updateOccurred?: boolean) => void;
    filamentId?: string;
  }>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [print, setPrint] = useState<IPrint>(getDefaultPrint());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const bearerToken = useBearerToken();

  const onChangeAmount = (amount: string) => {
    setPrint((f) => {
      return { ...f, amountUsed: Number(amount) };
    });
  };

  const handleClose = (updateOccurred: boolean) => {
    if (props.onClose) props.onClose(updateOccurred);
    //clear out any saved filaments when we close the dialog
    setPrint(getDefaultPrint());
  };
  const savePrint = async () => {
    setIsLoading(true);
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(print),
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (response.ok) {
      setSuccessMessage("Print created successfully.");
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
          <Select>
            <MenuItem value="someid">change this</MenuItem>
          </Select>
        </Stack>
      </EditDrawer>
    </>
  );
};

export default AddPrintDrawer;
