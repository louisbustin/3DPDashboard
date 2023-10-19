import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useState } from "react";

const ShrunkTextField = (props: TextFieldProps) => {
  const [shrink, setShrink] = useState(false);
  return (
    <TextField
      {...props}
      InputLabelProps={{
        shrink: props.value || props.value === 0 || shrink ? true : false,
      }}
      onFocus={() => setShrink(true)}
      onBlur={() => setShrink(false)}
    ></TextField>
  );
};

export default ShrunkTextField;
