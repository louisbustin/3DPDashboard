import { MenuItem } from "@mui/material";
import usePrinters from "../../hooks/use-printers";
import StyledSelect from "./StyledSelect";

const PrinterSelection = (
  props: React.PropsWithoutRef<{
    id?: string;
    label?: string;
    printerId?: string;
    onChange?: (printerId: string) => void;
    required?: boolean;
  }>,
) => {
  const printers = usePrinters();
  return (
    <>
      {!printers.isLoading && (
        <StyledSelect
          id={props.id || "printer-select"}
          label={props.label || "Printer"}
          value={props.printerId}
          onChange={(e) => {
            if (props.onChange) props.onChange(e.target.value as string);
          }}
          required={props.required}
        >
          {printers.printers?.map((printer) => (
            <MenuItem key={printer.id} value={printer.id}>
              {printer.brand} - {printer.name}
            </MenuItem>
          ))}
        </StyledSelect>
      )}
    </>
  );
};

export default PrinterSelection;
